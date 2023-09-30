import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import MultipleSelectChip from "./MultiSelect";
import Button from "@mui/material/Button";

export default function InputForm() {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const buttonStyle = {
    backgroundColor: 'blue', 
    color: 'white', // Text color
    '&:hover': {
      backgroundColor: 'darkblue', // Change this to the shade of blue you prefer on hover
    },
    marginTop: '10px',
    borderRadius: '5px',
  };

  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ width: "500px" }}
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
          <TextField id="outlined-basic" label="Zip Code" variant="outlined" />
          <MultipleSelectChip />
          <Button variant="contained" style={buttonStyle}>
            Submit
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
