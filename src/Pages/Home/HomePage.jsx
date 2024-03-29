/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./Home.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Box, Typography, Button } from "@mui/material";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { auth, app } from "../../Firebase/firebase";
import HomepagePic from "../../Assets/images/homepage1.png";
import LoginPage from "../Login/LoginPage";

const HomePage = () => {
  const [user, setUser] = useState(null); //setting to uid cause idk what else to put for now
  const db = getFirestore(app);
  const [formCompleted, setFormCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [firstName, setFirstName] = useState("");
  const { t, i18n } = useTranslation();

  const checkFormCompletion = async (email) => {
    const docRef = doc(db, "userProfiles", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFormCompleted(true);
      setFirstName(docSnap.data().values.firstName);
    }
  };

  const checkAdmin = async (email) => {
    const adminRef = doc(db, "admins", email);
    const docSnap = await getDoc(adminRef);
    console.log("aaaadmin", docSnap);
    if (docSnap.exists()) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const { uid, email } = authUser;
        // console.log("uid", uid);
        // console.log("email", email);
        setUser(uid);
        checkFormCompletion(email);
        console.log("useEffect", email);
        checkAdmin(email);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
      fontSize: 15,
    },
  });

  // <ThemeProvider theme={theme}></ThemeProvider>

  return (
    <ThemeProvider theme={theme}>
      <Grid>
        <Grid container sx={{ bgcolor: "#EAEAEA" }}>
          {user ? (
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                alignItems="center"
                justifyContent="center"
                display="flex"
              >
                <Box
                  component="img"
                  sx={{
                    objectFit: "cover",
                    width: 0.9,
                    height: 0.9,
                  }}
                  src={HomepagePic}
                  // alt="Trees"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                align="center"
                justify="center"
                alignItems="center"
                display="flex"
                direction="column"
              >
                <Grid
                  item
                  s={12}
                  sm={12}
                  md={12}
                  display="flex"
                  alignItems="center"
                  data-cy="grid-test"
                >
                  <Typography variant="h4" data-cy="message-test">
                    {t("WelcomeBack")} {firstName}!{" "}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  display="flex"
                  alignItems="center"
                >
                  <div>
                    <Typography variant="h6"> {t("Done")} </Typography>
                    <Button
                      fullWidth
                      id="signout"
                      data-testid="homeLink"
                      variant="contained"
                      sx={{ mt: 3, mb: 2, py: 1 }}
                      color="primary"
                      onClick={handleSignOut}
                    >
                      {t("SignOut")}
                    </Button>
                    {isAdmin === true ? (
                      <Button
                        fullWidth
                        id="signout"
                        data-testid="homeLink"
                        variant="outlined"
                        sx={{ mt: 3, mb: 2, py: 1 }}
                        color="primary"
                        onClick={() => {
                          window.location.href = "/admin/flaggedMessages";
                        }}
                      >
                        {t("AdminPage")}
                      </Button>
                    ) : (
                      <Typography> </Typography>
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  display="flex"
                  alignItems="center"
                >
                  {isAdmin === true ? (
                    <Typography> </Typography>
                  ) : formCompleted === false ? (
                    <div>
                      <Typography variant="h6">
                        {t("Lookslikeyou&apos;renew!")}
                      </Typography>
                      <Button
                        fullWidth
                        data-testid="createProfileLink"
                        variant="outlined"
                        sx={{ mt: 3, mb: 2, py: 1 }}
                        color="primary"
                        onClick={() => {
                          window.location.href = "/accountCreation";
                        }}
                      >
                        {t("CreateProfile")}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Typography variant="h6">
                        {" "}
                        {t("ChangeProfile")}{" "}
                      </Typography>
                      <Button
                        fullWidth
                        data-testid="editProfileButton"
                        variant="outlined"
                        sx={{ mt: 3, mb: 2, py: 1 }}
                        color="primary"
                        onClick={() => {
                          window.location.href = "/editProfile/myprofile";
                        }}
                      >
                        {t("EditProfile")}
                      </Button>
                    </div>
                  )}
                </Grid>
                <div>
                  {isAdmin === true ? (
                    <Typography> </Typography>
                  ) : (
                    <Link
                      onClick={() => {
                        window.location.href = "/createRecruiter";
                      }}
                    >
                      {t("recruiter")}
                    </Link>
                  )}
                </div>
              </Grid>
            </Grid>
          ) : (
            <div>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  alignItems="center"
                  justifyContent="center"
                  display="flex"
                >
                  <Box
                    component="img"
                    sx={{
                      objectFit: "cover",
                      width: 0.9,
                      height: 0.9,
                    }}
                    src={HomepagePic}
                    // alt="Trees"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <LoginPage sx={{ bgcolor: "red" }} />
                </Grid>
              </Grid>
            </div>
          )}
          {/* <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              <Box
              component="img"
                sx={{
                  objectFit: "cover",
                  width: 0.9,
                  height: 0.9,
                }}
                src={HomepagePic}
                // alt="Trees"
              />
              </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Login />
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default HomePage;
