const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
const SERVER_URL = process.env.SERVER_URL;
const SERVER_PORT = process.env.SERVER_PORT;

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
    }
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

app.listen(SERVER_PORT, () => {
    console.log(`Server started on ${SERVER_URL}`);
});
