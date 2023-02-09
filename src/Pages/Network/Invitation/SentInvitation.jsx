import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Navbar from "../../../Components/Navbar/Navbar";
import SentInvitationCard from "../../../Components/Network/SentInvitationCard";

const theme = createTheme();
const test = [1, 2, 3, 4];

const SentInvitation = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Sent Invitation
      </Typography>
      <Box justifyContent="center" alignItems="center" minHeight="60vh">
        {/*The array will contain all the connected users*/}
        <Grid container spacing={3}>
          {Array.from(test).map((_, index) => (
            <Grid item>
              <SentInvitationCard />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </ThemeProvider>
);

export default SentInvitation;
