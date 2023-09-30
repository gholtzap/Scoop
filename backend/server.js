const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const OpenAI = require('openai').default;
const bcrypt = require('bcrypt');

const app = express();

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
const SERVER_URL = process.env.SERVER_URL;
const SERVER_PORT = process.env.SERVER_PORT;


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


mongoose.set('debug', true);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
    console.log('Connected to Database:', db.name);
});

const symptomSchema = new mongoose.Schema({
    zip: String,
    symptoms: {
        type: Object,
        required: true
    },
    population: Number
});

const Symptom = mongoose.model('Symptom', symptomSchema, 'zips');

app.use(cors());
app.use(express.json());

app.get('/symptoms/:zip', async (req, res) => {
    try {
        console.log('Database Connection State:', db.readyState);

        const zip = req.params.zip;
        console.log('Requested ZIP:', zip);

        const symptoms = await Symptom.findOne({ zip: zip });
        console.log('Database Result:', symptoms);

        if (symptoms) {
            res.json(symptoms);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
});


app.post('/analyze', async (req, res) => {
    const { summary } = req.body;

    try {
        const completion = await openai.ChatCompletion.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: summary }
            ]
        });

        const insight = completion.choices[0].message.content.trim();
        res.json({ insight });
    } catch (error) {
        console.error("Error querying OpenAI:", error);
        res.status(500).json({ message: error.message });
    }
});


async function getOutbreakAnalysis(zip, population, symptoms) {

    const symptomSummary = Object.entries(symptoms)
        .map(([symptom, count]) => `${count} out of ${population} people have ${symptom}`)
        .join(', ');

    const summary = `In my simulation video game, there is an area with a population of ${population} where ${symptomSummary}. 
Based on these symptoms, what real-life disease might be prevalent in my video game simulation? 
Note that there can be no significant disease prevalent. You are allowed to return 'None'. If the number of symptoms is not significant
enough compared to the population, you should return 'None'.
Return me ONLY the disease which you believe is most applicable given these symptoms, in this format, for example:
The result is Common Cold.`;


    const conversation = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: summary }
    ];

    const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversation
    });

    return result.choices[0].message.content;
}


app.get('/analyze/:zip', async (req, res) => {
    try {
        const zip = req.params.zip;
        const data = await Symptom.findOne({ zip: zip });

        if (!data) {
            return res.status(404).json({ message: "ZIP not found" });
        }

        if (!data.population) {
            return res.status(400).json({ message: "Population data missing for this ZIP" });
        }

        const analysis = await getOutbreakAnalysis(zip, data.population, data.symptoms);
        res.json({ analysis });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
});


const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema, 'users');

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Login endpoint

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.json({ message: "Login successful!" });
        } else {
            res.status(401).json({ message: "Invalid password!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

