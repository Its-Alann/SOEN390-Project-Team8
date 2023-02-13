import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import Divider from "@material-ui/core/Divider";
// import TextField from "@material-ui/core/TextField";
// import Typography from "@material-ui/core/Typography";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import Avatar from "@material-ui/core/Avatar";
// import Fab from "@material-ui/core/Fab";
// import SendIcon from "@material-ui/icons/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import Navbar from "../../Components/Navbar/Navbar";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme();
// get our sender s email
//const user = auth.currentUser.email;
//
const user = "billybob@gmail.com";

const Chat = () => {
  const [dmList, setDmList] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // get all names of user's receivers
  const getAllReceivers = async () => {
    let querySnapshot = await getDocs(collection(db, "messages"));
    const allAuthors = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (doc.data().authors.includes(user)) {
        const recipients = doc
          .data()
          .authors.filter((author) => author !== user);

        allAuthors.push(recipients);
      }

      setDmList(allAuthors);
    });

    querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = doc.id; //currentuser
      allAuthors.forEach((el) => {
        if (el[0] !== userID) {
          allUsers.push(doc.data().values.firstName);
        }
        setProfiles(allUsers);
      });
    });
  };

  useEffect(() => {
    // display automatically the names of the user's receivers
    getAllReceivers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        {/* <p>
          {" "}
          {dmList.map((el) => (
            <p> {el} </p>
          ))}{" "}
        </p> */}
        <p>
          {" "}
          {profiles.map((el) => (
            <p> {el} </p>
          ))}{" "}
        </p>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
