import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const symptoms = [
    'Fever',
    'Fatigue',
    'Cough',
    'Shortness Of Breath',
    'Sore Throat',
    'Runny Nose',
    'Body Aches',
    'Headache',
    'Chills',
    'Nausea',
    'Diarrhea',
    'Loss Of Appetite',
    'Sweating',
    'Joint Pain',
    'Swollen Lymph Nodes',
    'Rash',
    'Abdominal Pain',
    'Dizziness',
    'Loss Of Taste Or Smell',
    'Chest Pain'
].sort();

export default function MultiSelect() {

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event: any, value: any) => setSelectedOptions(value);

  return (
    <Autocomplete
      sx={{mt: "30px", width: '90%' }}
      multiple
      options={symptoms}
      getOptionLabel={(option) => option}
      onChange={handleChange}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="What Are Your Symptoms?"
          placeholder="Search For Symptoms"
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}