import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import MultipleSelectChip from "./MultiSelect";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

const manualMapping: any = {
  Fever: "fever",
  Fatigue: "fatigue",
  Cough: "cough",
  "Shortness Of Breath": "shortnessOfBreath",
  "Sore Throat": "soreThroat",
  "Runny Nose": "runnyNose",
  "Body Aches": "bodyAches",
  Headache: "headache",
  Chills: "chills",
  Nausea: "nausea",
  Diarrhea: "diarrhea",
  "Loss Of Appetite": "lossOfAppetite",
  Sweating: "sweating",
  "Joint Pain": "jointPain",
  "Swollen Lymph Nodes": "swollenLymphNodes",
  Rash: "rash",
  "Abdominal Pain": "abdominalPain",
  Dizziness: "dizziness",
  "Loss Of Taste Or Smell": "lossOfTasteOrSmell",
  "Chest Pain": "chestPain",
};

export default function InputForm() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [zipCode, setZipCode] = useState("");

  const buttonStyle = {
    backgroundColor: "#00827f",
    color: "white", // Text color
    marginTop: "30px",
    borderRadius: "5px",
    fontFamily: "Poppins",
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleButtonClick = async () => {
    // Check zipCode is 5 digits
    if (zipCode.length !== 5 || !Number(zipCode)) {
      alert("Please enter a valid zip code");
      return;
    }
    const body: any = {
      zipCode: zipCode,
    };

    for (const key in manualMapping) {
      const value = manualMapping[key];
      body[value] = 0;
    }

    for (const option of selectedOptions) {
      const value = manualMapping[option];
      body[value] = 1;
    }

    try {
      const response = await fetch(`${SERVER_URL}/postSymptoms`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.status === 200) {
          alert(data.message);
      } else {
          alert(data.message);
      }
    } catch (error) {
        console.error("Error during posting:", error);
        alert("Error during posting. Please try again");
    }

    console.log(body);

    setZipCode("");
    setSelectedOptions([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: 5 }}>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{ width: "300px" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography sx={{ width: "100%", flexShrink: 0 }}>
              Report Symptoms
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="outlined-basic"
              label="Zip Code"
              variant="standard"
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setZipCode(e.target.value)}
              value={zipCode}
            />
            <MultipleSelectChip
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
            <Button
              variant="contained"
              style={buttonStyle}
              onClick={handleButtonClick}
            >
              Submit
            </Button>
          </AccordionDetails>
        </Accordion>
      </Box>
    </ThemeProvider>
  );
}
