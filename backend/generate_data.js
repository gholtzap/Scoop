// ###############################################################################


// ###############################################################################



const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');


require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
const SERVER_URL = process.env.SERVER_URL;
const SERVER_PORT = process.env.SERVER_PORT;

const csvFilePath = './California_Zip_Codes.csv';


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

    const symptomSchema = new mongoose.Schema({
        zip: String,
        population: Number,
        symptoms: {
            type: Object,
            required: true
        }
    });


    const Symptom = mongoose.model('Symptom', symptomSchema, 'zips');
    const results = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', async () => {
            for (const row of results) {
                const zip = row.ZIP_CODE;
                const population = Number(row.POPULATION); 
                const symptoms = generateRandomSymptoms();
                try {
                    await Symptom.findOneAndUpdate(
                        { zip: zip },
                        {
                            population: population,  
                            symptoms: symptoms
                        },
                        { upsert: true }
                    );
                    console.log(`Processed ZIP: ${zip}`);
                } catch (error) {
                    console.error(`Error processing ZIP: ${zip}`, error);
                }
            }
        });
        
});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomSymptoms() {
    return {
        fever: getRandomInt(0, 100),
        fatigue: getRandomInt(0, 100),
        cough: getRandomInt(0, 100),
        shortnessOfBreath: getRandomInt(0, 100),
        soreThroat: getRandomInt(0, 100),
        runnyNose: getRandomInt(0, 100),
        bodyAches: getRandomInt(0, 100),
        headache: getRandomInt(0, 100),
        chills: getRandomInt(0, 100),
        nausea: getRandomInt(0, 100),
        diarrhea: getRandomInt(0, 100),
        lossOfAppetite: getRandomInt(0, 100),
        sweating: getRandomInt(0, 100),
        jointPain: getRandomInt(0, 100),
        swollenLymphNodes: getRandomInt(0, 100),
        rash: getRandomInt(0, 100),
        abdominalPain: getRandomInt(0, 100),
        dizziness: getRandomInt(0, 100),
        lossOfTasteOrSmell: getRandomInt(0, 100),
        chestPain: getRandomInt(0, 100),
    };
}




