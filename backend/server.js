const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai").default;

const fs = require("fs");
const csv = require("csv-parser");

const app = express();

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const SERVER_URL = process.env.SERVER_URL;
const SERVER_PORT = process.env.SERVER_PORT;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

mongoose.set("debug", true);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
  console.log("Connected to Database:", db.name);
});

const symptomSchema = new mongoose.Schema({
  zip: String,
  symptoms: {
    type: Object,
    required: true,
  },
  population: Number,
});

const Symptom = mongoose.model("Symptom", symptomSchema, "zips");

app.use(cors());
app.use(express.json());

app.get("/symptoms/:zip", async (req, res) => {
  try {
    console.log("Database Connection State:", db.readyState);

    const zip = req.params.zip;
    console.log("Requested ZIP:", zip);

    const symptoms = await Symptom.findOne({ zip: zip });
    console.log("Database Result:", symptoms);

    if (symptoms) {
      res.json(symptoms);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/analyze", async (req, res) => {
  const { summary } = req.body;

  try {
    const completion = await openai.ChatCompletion.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: summary },
      ],
    });

    const insight = completion.choices[0].message.content.trim();
    res.json({ insight });
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    res.status(500).json({ message: error.message });
  }
});

async function getOutbreakAnalysis(zip, zipRow, population, symptoms) {
  const symptomSummary = Object.entries(symptoms)
    .map(
      ([symptom, count]) =>
        `${count} out of ${population} people have ${symptom}`
    )
    .join(", ");
  const summary = `In my simulation video game, there is an area with a population of ${population} where ${symptomSummary} and details about the zipcode in area are: ${zipRow}. 
  Based on these symptoms, what real-life disease might be prevalent in my video game simulation?
  Note that there can be no significant disease prevalent If the number of symptoms is not significant enough compared to the population, you should return 'None'

  provide this information as a json similar to this:
  {
  "possibleDiseases": ["common cold": {severitylevel}, "influenza":{severitylevel}] // each disease in possibleDiseases should have a low, mild, moderate, severe, critical based on the given information 
and if there are no potential diseases use ["none"]
  "safetyGuidelines":["{3 sentence safety guideline for disease such as common cold"},"{same for rest of possibleDiseases}"]
  "percentageReported": {population / count of everyone with symptoms}
  // also create fields for possible amount infected with listed possible Diseases
  // also create a field that describes population density
  // create fields for each symptom with count ex: "headache": int
  // also include zipCode: {zipCode}
  // also include population: {population}
  // and create an age distribution, vaccination Status, and comorbidities fields in this exact format
    "ageDistribution": {
      "0-18": 5487,
      "19-35": 9765,
      "36-60": 16542,
      "61+": 2894
    },
    "vaccinationStatus": {
      "fullyVaccinated": 16234,
      "partiallyVaccinated": 12456,
      "notVaccinated": 10032
    },
    "comorbidities": {
      "diabetes": 2654,
      "hypertension": 4762,
      "respiratoryConditions": 2375
    }
  }
  `;
  console.log("prompt", summary);
  const conversation = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: summary },
  ];

  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversation,
  });

  return result.choices[0].message.content;
}

function getDataByZipcode(zip) {
  return new Promise((resolve, reject) => {
    let matchedRow = null;
    let headers = null;
    fs.createReadStream("California_Zip_Codes.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (!headers) {
          headers = Object.keys(row);
        }
        if (row.ZIP_CODE === zip) {
          matchedRow = row;
        }
      })
      .on("end", () => {
        if (matchedRow) {
          const rowData = headers
            .map((header) => `${header} = ${matchedRow[header]}`)
            .join(", ");
          resolve(rowData);
        } else {
          reject(new Error(`No data found for ZIP code '${zip}'`));
        }
      });
  });
}

app.get("/analyze/:zip", async (req, res) => {
  try {
    const zip = req.params.zip;
    const data = await Symptom.findOne({ zip: zip });
    let zipRow = "";
    if (!data) {
      return res.status(404).json({ message: "ZIP not found" });
    }

    if (!data.population) {
      return res
        .status(400)
        .json({ message: "Population data missing for this ZIP" });
    }

    try {
      zipRow = await getDataByZipcode(zip);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
    const analysis = await getOutbreakAnalysis(
      zip,
      zipRow,
      data.population,
      data.symptoms
    );
    res.json({ analysis });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server started on ${SERVER_URL}/${SERVER_PORT}`);
});
