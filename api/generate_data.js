const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');


require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
const SERVER_URL = process.env.SERVER_URL;
// const SERVER_PORT = process.env.SERVER_PORT;

const csvFilePath = './California_Zip_Codes.csv';


mongoose.set('debug', true);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const symptoms = [
    'fever', 'fatigue', 'cough', 'shortnessOfBreath', 'soreThroat', 'runnyNose', 
    'bodyAches', 'headache', 'chills', 'nausea', 'diarrhea', 'lossOfAppetite', 'sweating',
    'jointPain', 'swollenLymphNodes', 'rash', 'abdominalPain', 'dizziness', 'lossOfTasteOrSmell',
    'chestPain'
]

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
    console.log('Connected to Database:', db.name);

    const symptomSchema = new mongoose.Schema({
        zip: String,
        entries: [ new mongoose.Schema({
                day: Number,
                symptoms: {
                    type: Object,
                    required: true
                }
            })
        ],
        population: Number
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
                const entries = generateRandomEntries(population);
                try {
                    await Symptom.findOneAndUpdate(
                        { zip: zip },
                        {
                            population: population,
                            entries: entries
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

function generateRandomSymptoms(population, lambda){
    const randomSymptoms = {}
    symptoms.forEach((item, index) => {
        randomSymptoms[item] = getScaledExponential(lambda, population)
    })
    return randomSymptoms
}


function generateRandomEntries(population) {
    if (population < 0){ population = 0 }

    const lambda = 500;

    const numEntries = 25 //number of days we are filling
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const day = Math.floor(currentTime / (1000 * 60 * 60 * 24))

    console.log(day)

    entries = []
    const symptomsSum = {};
    symptoms.forEach((item, index) => {
        symptomsSum[item] = 0;
    })
    for (let i = numEntries; i >= 0; i--){
        let curDay = day - i;
        let newSymptoms = generateRandomSymptoms(population, lambda);
        symptoms.forEach((item, index) => {
            symptomsSum[item] += newSymptoms[item];
        })
        let copy = Object.assign({}, symptomsSum);
        entries.push({
            day: curDay,
            symptoms: copy
        })
    }
    return entries;

}