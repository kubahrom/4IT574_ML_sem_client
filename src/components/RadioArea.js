import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

export default function RadioArea({ selectedModel, setSelectedModel }) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedModel}
        onChange={setSelectedModel}
      >
        <FormControlLabel value="v1" control={<Radio />} label="v1" />
        <FormControlLabel value="v2" control={<Radio />} label="v2" />
        <FormControlLabel value="tf" control={<Radio />} label="Tensorflow" />
      </RadioGroup>
    </FormControl>
  );
}
