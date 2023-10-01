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
// import * as Accordion from "@radix-ui/react-accordion";

export default function InputForm() {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const buttonStyle = {
    backgroundColor: "#00827f",
    color: "white", // Text color
    marginTop: "30px",
    borderRadius: "5px",
    fontFamily: 'Poppins',
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: 5 }}>
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
            <TextField
              id="outlined-basic"
              label="Zip Code"
              variant="standard"
            />
            <MultipleSelectChip />
            <Button variant="contained" style={buttonStyle}>
              Submit
            </Button>
          </AccordionDetails>
        </Accordion>
      </Box>
    </ThemeProvider>
  );
}
