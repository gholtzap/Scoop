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
                const symptoms = generateRandomSymptoms(population);
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

function getRandomExponential(lambda) {
    return -Math.log(1.0 - Math.random()) / lambda;
}

function getScaledExponential(lambda, population) {
    const percentage = getRandomExponential(lambda);
    const scaledValue = Math.floor(percentage * population);
    return scaledValue;
}


function generateRandomSymptoms(population) {

    const lambda = 5;

    return {
        fever: getScaledExponential(lambda, population),
        fatigue: getScaledExponential(lambda, population),
        cough: getScaledExponential(lambda, population),
        shortnessOfBreath: getScaledExponential(lambda, population),
        soreThroat: getScaledExponential(lambda, population),
        runnyNose: getScaledExponential(lambda, population),
        bodyAches: getScaledExponential(lambda, population),
        headache: getScaledExponential(lambda, population),
        chills: getScaledExponential(lambda, population),
        nausea: getScaledExponential(lambda, population),
        diarrhea: getScaledExponential(lambda, population),
        lossOfAppetite: getScaledExponential(lambda, population),
        sweating: getScaledExponential(lambda, population),
        jointPain: getScaledExponential(lambda, population),
        swollenLymphNodes: getScaledExponential(lambda, population),
        rash: getScaledExponential(lambda, population),
        abdominalPain: getScaledExponential(lambda, population),
        dizziness: getScaledExponential(lambda, population),
        lossOfTasteOrSmell: getScaledExponential(lambda, population),
        chestPain: getScaledExponential(lambda, population),
    };
}




