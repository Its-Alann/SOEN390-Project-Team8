import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Background from "./Pages/Background/Background";
import HomePage from "./Pages/Home/HomePage";
import AnotherPage from "./Pages/AnotherPage/AnotherPage";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUp/SignUpPage";
import MessagingPage from "./Pages/Messaging/MessagingPage";
import AccountCreationPage from "./Pages/AccountCreation/AccountCreationPage";
import EditProfilePage from "./Pages/EditProfile/EditProfilePage";
import { ViewNetwork } from "./Pages/Network/MyConnections/ViewNetwork";
import { SentInvitation } from "./Pages/Network/Invitation/SentInvitation";
import NetworkPage from "./Pages/Network/NetworkPage";
import { ReceivedInvitation } from "./Pages/Network/Invitation/ReceivedInvitation";
import { NetworkPossibleConnections } from "./Pages/Network/NetworkPossibleConnections";
import Navbar from "./Components/Navbar/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ToBeTested from "./Pages/ToBeTested/ToBeTested";

const App = () => {
  const hello = "helloo";

  //asds//

  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar> </Navbar>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/" exact element={<Background />} />
            <Route path="/" exact element={<AnotherPage />} />
            <Route path="/login" exact element={<LoginPage />} />
            <Route path="/signup" exact element={<SignUpPage />} />
            <Route
              path="/accountCreation"
              exact
              element={<AccountCreationPage />}
            />
            <Route
              path="/editProfile"
              exact
              element={
                <ProtectedRoute redirect="/">
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/network" exact element={<NetworkPage />} />
            <Route path="/messaging" export element={<MessagingPage />} />
            <Route path="/myNetwork" exact element={<ViewNetwork />} />
            <Route path="/invitations" exact element={<ReceivedInvitation />} />
            <Route path="/sentRequests" exact element={<SentInvitation />} />
            <Route
              path="/possibleConnections"
              exact
              element={<NetworkPossibleConnections />}
            />
            <Route path="/testingOtherPages" exact element={<ToBeTested />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
