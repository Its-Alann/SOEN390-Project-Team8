import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import TextField from "@mui/material/TextField";

const NameForm = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "15vh" }}
  >
    <Grid xs={8}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="First Name"
        variant="standard"
      />
    </Grid>
    <Grid xs={8}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Last Name"
        variant="standard"
      />
    </Grid>
  </Grid>
);

export default NameForm;
