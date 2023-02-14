import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../../../Components/Navbar/Navbar";
import SentInvitationCard from "../../../Components/Network/SentInvitationCard";
import { db } from "../../../Firebase/firebase";

const theme = createTheme();

export const SentInvitation = () => {
  const usersRef = collection(db, "userProfiles");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      // READ DATA
      try {
        // get data from reference collection
        const data = await getDocs(usersRef);
        const users = data.docs.map((doc) => ({
          // all users is an array of users
          ...doc.data(),
          id: doc.id,
        }));
        setAllUsers(users);
        // console.log(users);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
          <CssBaseline />
          <Typography variant="h4" gutterBottom>
            Sent Invitation
          </Typography>
          <Box
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            display="flex"
          >
            {/*The array will contain all the connected users*/}
            <Grid
              container
              spacing={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {allUsers.map((user) => (
                <Grid item>
                  <SentInvitationCard
                    userImage={user.values.image}
                    userFirstName={user.values.firstName}
                    userLastName={user.values.lastName}
                    userBio={user.values.description}
                    userid={user.id}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default SentInvitation;
