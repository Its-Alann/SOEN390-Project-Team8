import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Navbar from "../../../Components/Navbar/Navbar";
import NetworkCards from "../../../Components/Network/NetworkCards";

const theme = createTheme();
const test = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ViewNetwork = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div>View Network</div>
      {/*The array will contain all the connected users*/}
      <Grid container spacing={3}>
        {Array.from(test).map((_, index) => (
          <Grid item>
            <NetworkCards />
          </Grid>
        ))}
      </Grid>
    </Container>
  </ThemeProvider>
);

export default ViewNetwork;
