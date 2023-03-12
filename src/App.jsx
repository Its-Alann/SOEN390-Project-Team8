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
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUp/SignUpPage";
import MessagingPage from "./Pages/Messaging/MessagingPage";
import AccountCreationPage from "./Pages/AccountCreation/AccountCreationPage";
import EditProfilePage from "./Pages/EditProfile/EditProfilePage";
import { ViewNetwork } from "./Pages/Network/MyConnections/ViewNetwork";
import { SentInvitation } from "./Pages/Network/Invitation/SentInvitation";
import { ReceivedInvitation } from "./Pages/Network/Invitation/ReceivedInvitation";
import Navbar from "./Components/Navbar/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NetworkPage from "./Pages/Network/NetworkPage";
import { AuthProvider } from "./context/AuthContext";

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
      <AuthProvider>
        <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" exact element={<HomePage />} />
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
              <Route
                path="/invitations"
                exact
                element={<ReceivedInvitation />}
              />
              <Route path="/sentRequests" exact element={<SentInvitation />} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
