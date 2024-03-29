import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  Box,
  IconButton,
  Stack,
  useMediaQuery,
  ListItemButton,
  ListItemText,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useTranslation } from "react-i18next";
import GroupIcon from "@mui/icons-material/Group";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { onAuthStateChanged } from "firebase/auth";
import SendChat from "../../Components/SendChat/SendChat";
// import "./Messaging.css";
import MessageList from "../../Components/Messaging/MessageList";
import { auth, db } from "../../Firebase/firebase";
import NewConvo from "../../Components/NewConvo/NewConvo";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    secondary: { main: "#CAF0F8" },
    background: { main: "#EAEAEA" },
    gray: { main: "#D9D9D9" },
  },
  typography: {
    fontFamily: ["Proxima Nova"],
  },
});

const findLastSeen = (arr, searchValue) => {
  const reverseIndex = arr
    .slice()
    .reverse()
    .findIndex((x) => x.seenBy.includes(searchValue));
  const lastIndex =
    reverseIndex >= 0 ? arr.length - 1 - reverseIndex : reverseIndex;
  return lastIndex;
};

const Messaging = () => {
  // State for writing messages
  const [messages, setMessages] = useState([]);

  // State for the current conversation to display
  const [convoId, setConvoId] = useState("");

  // an array with info for displaying the convo info
  const [chatProfiles, setChatProfiles] = useState([]);
  const [name, setName] = useState("");

  // current user's email
  const [myUser, setMyUser] = useState("");

  //tracks the convo in the sidebar
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // true when on mobile
  const mediaMobile = useMediaQuery("only screen and (max-width: 600px)");

  // ref to dummy div under messageLIst
  const dummy = useRef();

  // tracks when we use the new convo button
  const [newConvo, setNewConvo] = useState(false);

  //all the authors in the selected conversation
  const [authors, setAuthors] = useState([]);

  //the name of the editable group name (only gorup chats)
  const [groupNameEdit, setGroupNameEdit] = useState("");

  // the current avatar image for the selectedConvo
  const [avatarImage, setAvatarImage] = useState("");

  const [groupMenuAnchorEl, setGroupMenuAnchorEl] = useState(null);
  const groupMenuOpen = Boolean(groupMenuAnchorEl);

  //to autoscroll
  const messageViewRef = useRef();
  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behaviour: "smooth" });
  };

  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  // takes an object {otherAuthors, mostRecent, unRead, groupName}
  const getOtherAuthors = async (chatInfo) => {
    const nameList = [];
    let imageUrl = "";
    await Promise.all(
      chatInfo.otherAuthors.map(async (author) => {
        const docSnap = await getDoc(doc(db, "userProfiles", author));
        if (docSnap.exists()) {
          nameList.push(
            `${docSnap.data().values.firstName} ${
              docSnap.data().values.lastName
            }`
          );
          if (chatInfo.otherAuthors.length < 2) {
            imageUrl = docSnap.data().values.image;
          }
        }
      })
    );
    // format the names
    const names = nameList.filter(Boolean).join(", ");
    return {
      names,
      emails: chatInfo.otherAuthors,
      mostRecent: chatInfo.mostRecent,
      unRead: chatInfo.unRead,
      groupName: chatInfo.groupName,
      imageUrl,
    };
  };

  // get all names of user's receivers
  // populate the message sidebar
  const getAllReceivers = async () => {
    setChatProfiles([]);
    const messagesRef = collection(db, "messages");

    // Searches all converstations containing the currentUser
    const convosQuery = query(
      messagesRef,
      where("authors", "array-contains", myUser)
    );

    // set listener to convos involving the user
    const unSub = onSnapshot(convosQuery, async (querySnapshot) => {
      //list of author lists
      const allAuthorsList = [];
      //each document is a convo
      querySnapshot.forEach((document) => {
        const data = document.data();
        if (data.messages.length < 1) return;
        const mostRecent = data.messages?.at(-1).timestamp.toDate();
        const unRead = !data.messages?.at(-1).seenBy.includes(myUser);
        const groupName = data.groupName ?? null;
        allAuthorsList.push({
          otherAuthors: data.authors.filter((author) => author !== myUser),
          mostRecent,
          unRead,
          groupName,
        });
      });

      const allChatProfiles = await Promise.all(
        allAuthorsList.map(getOtherAuthors)
      );
      /*
      {
        names: "Billy Bob, Yodie Gang"
        emails: ["billybob@gmail.com", "yodiegang@ful.com"]
      }   
      */
      allChatProfiles.sort((a, b) =>
        a.mostRecent < b.mostRecent ? 1 : a.mostRecent > b.mostRecent ? -1 : 0
      );
      setChatProfiles(allChatProfiles);
    });
  };

  // returns the ID of the currently selected conversation
  const getConversationId = async (authorsList) => {
    authorsList.sort();
    const messagesRef = collection(db, "messages");
    const convoQuery = query(messagesRef, where("authors", "==", authorsList));
    const querySnapshot = await getDocs(convoQuery);

    // probably redundant cause it should exist
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, "messages"), {
        authors: authorsList,
        messages: [],
      });
      console.log(
        "findConversation: no existing conversation found, creating new one between",
        authorsList,
        "new id:",
        docRef.id
      );
      return docRef.id;
    }
    console.log(
      "Existing conversations found between",
      authorsList,
      "id:",
      querySnapshot.docs[0].id
    );
    return querySnapshot.docs[0].id;
  };

  const selectConvo = async (
    conversationId,
    names,
    index,
    emails,
    groupName,
    avatarUrl
  ) => {
    // !there may be sync issues related to the read receipts
    // !simply putting setAuthors before setConvoId may not be sufficient
    setAuthors(emails);
    if (groupName) setName(groupName);
    else setName(names);
    setSelectedIndex(index);
    setConvoId(conversationId);
    setAvatarImage(avatarUrl);
    scrollToBottom();
  };

  const markMessagesAsRead = async () => {
    if (messages.length === 0 || messages.at(-1).seenBy.includes(myUser)) {
      return;
    }
    const updatedMessages = messages.map((m) => {
      // dont want the readReceipt part to write to the db
      const { readReceipt, ...updated } = m;

      if (!m.seenBy) updated.seenBy = [myUser];
      else if (!m.seenBy?.includes(myUser)) updated.seenBy.push(myUser);

      return updated;
    });
    const convoRef = doc(db, "messages", convoId);
    await updateDoc(convoRef, {
      messages: updatedMessages,
    });
  };

  // changes the groupname in the convo documentn
  const changeGroupName = async (docId, newName) => {
    const convoRef = doc(db, "messages", docId);
    await updateDoc(convoRef, {
      groupName: newName,
    });
    setGroupNameEdit("");
  };

  const handleGroupMenuOpen = (e) => {
    setGroupMenuAnchorEl(e.currentTarget);
  };

  const handleGroupMenuClose = () => {
    setGroupMenuAnchorEl(null);
  };

  // auth listener on load
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUser(user.email);
        console.log("user.email", user.email);
        // getAllReceivers();
      } else {
        console.log("User must be signed in");
      }
    });
  }, []);

  //can make this an onclick
  useEffect(() => {
    if (newConvo) {
      setSelectedIndex(-1);
      setMessages([]);
      setConvoId("");
      setName(t("NewConvo"));
    }
  }, [newConvo]);

  //set a listener to on the conversation document
  useEffect(() => {
    let unSub;
    if (convoId) {
      setNewConvo(false);
      const convoRef = doc(db, "messages", convoId);

      unSub = onSnapshot(convoRef, (document) => {
        const tempMsgs = document.data().messages;
        authors.forEach((a) => {
          const index = findLastSeen(tempMsgs, a);
          if (index < 0) return;
          if (!tempMsgs[index].readReceipt) {
            tempMsgs[index].readReceipt = [a];
          } else {
            tempMsgs[index].readReceipt.push(a);
          }
        });
        // console.log("tempMsgs", tempMsgs);
        setMessages(tempMsgs);
        if (document.data().authors.length > 2 && document.data().groupName)
          setName(document.data().groupName);
      });
    }
  }, [convoId]);

  useEffect(() => {
    getAllReceivers();
  }, [myUser]);

  //if the conversations changes, scroll to bottom
  useEffect(() => {
    //wont scroll to bottom if there are no chats selected
    if (messages.length > 0) {
      scrollToBottom();
    }
    markMessagesAsRead();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box className="page" sx={{ overflow: "hidden" }}>
        <Box>
          <Grid
            container
            className="messaging-container"
            spacing={3}
            sx={{
              m: "auto",
              mt: 2,
              maxWidth: 1000,
              height: `calc(95vh - ${theme.mixins.toolbar.minHeight}px - 16px)`,
            }}
          >
            <Grid
              className="message-sidebar"
              xs
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                maxHeight: "100%",
                p: 0,
                display:
                  mediaMobile && selectedIndex > -1 ? "none" : "inline-block",
              }}
            >
              <Box
                sx={{ display: "flex", p: 1, justifyContent: "space-between" }}
              >
                <Typography color="primary" variant="h4" noWrap>
                  {t("Messaging")}
                </Typography>
                <IconButton
                  data-cy="startNewConvo"
                  onClick={() => setNewConvo(!newConvo)}
                >
                  <AddCommentIcon />
                </IconButton>
              </Box>

              <Grid
                className="convo-list"
                sx={{
                  overflow: "auto",
                  height: "auto",
                  bgcolor: "white",
                  p: 0,
                }}
              >
                <List>
                  {chatProfiles.map((chat, i) => (
                    <ListItemButton
                      className="sidebar-item"
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      onClick={async () => {
                        const conversationID = await getConversationId([
                          ...chat.emails,
                          myUser,
                        ]);
                        await selectConvo(
                          conversationID,
                          chat.names,
                          i,
                          [myUser, ...chat.emails],
                          chat.groupName,
                          chat.imageUrl
                        );
                      }}
                    >
                      <ListItemAvatar>
                        {chat.emails.length > 1 ? (
                          <GroupIcon fontSize="large" />
                        ) : (
                          <Avatar alt="profilePic" src={chat.imageUrl} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.groupName || chat.names}
                        primaryTypographyProps={{ noWrap: true }}
                        secondary={chat.mostRecent.toDateString()}
                      />
                      {chat.unRead && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          color="warning"
                        />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Grid
              ref={messageViewRef}
              className="message-view"
              sm={8}
              xs={12}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                ml: mediaMobile ? 0 : 2,
                p: 0,
                maxHeight: "100%",
                display: mediaMobile && selectedIndex < 0 ? "none" : null,
              }}
            >
              <Stack sx={{ height: "100%" }}>
                <div
                  className="message-view-banner"
                  style={{
                    maxHeight: "64px",
                    backgroundColor: "#2b2f90",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "8px 8px 0 0",
                    padding: "12px",
                  }}
                >
                  {mediaMobile && (
                    <IconButton
                      aria-label="back"
                      id="ChevronIcon"
                      onClick={() => {
                        setSelectedIndex(-1);
                      }}
                    >
                      <ChevronLeftIcon sx={{ color: "white" }} />
                    </IconButton>
                  )}

                  {authors.length > 2 ? (
                    <TextField
                      placeholder={name}
                      variant="standard"
                      color="secondary"
                      fullWidth
                      value={groupNameEdit}
                      onChange={(e) => {
                        setGroupNameEdit(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          changeGroupName(convoId, groupNameEdit);
                        }
                      }}
                      inputProps={{
                        sx: {
                          color: "white",
                          fontSize: "2.125rem",
                          "&::placeholder": {
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="h4" noWrap>
                      {name}
                    </Typography>
                  )}
                  {authors.length > 2 ? (
                    <>
                      <GroupIcon
                        fontSize="large"
                        onClick={handleGroupMenuOpen}
                        sx={{ cursor: "pointer" }}
                      />
                      <Menu
                        anchorEl={groupMenuAnchorEl}
                        open={groupMenuOpen}
                        onClose={handleGroupMenuClose}
                      >
                        {authors.map((author) => (
                          <MenuItem
                            sx={{
                              "&:hover": { backgroundColor: "transparent" },
                              cursor: "default",
                            }}
                            key={author}
                            disableRipple
                          >
                            {author}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
                    <Avatar alt="profilePic" src={avatarImage} />
                  )}
                </div>
                {newConvo && (
                  <NewConvo
                    selectConvo={selectConvo}
                    getConversationId={getConversationId}
                    getOtherAuthors={getOtherAuthors}
                  />
                )}
                <Box
                  id="message-chats"
                  sx={{
                    bgcolor: "white",
                    height: "100%",
                    overflow: "auto",
                    p: 0,
                    overflowX: "hidden",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  <MessageList messages={messages} convoId={convoId} />
                  <div ref={dummy} />
                </Box>
                {selectedIndex > -1 && (
                  <Box
                    sx={{
                      bgcolor: "gray.main",
                      alignItems: "center",
                      justifyItems: "center",
                      p: 0,
                      borderRadius: "0 0 8px 8px",
                      borderTop: "1px solid gray",
                    }}
                  >
                    <SendChat
                      conversationID={convoId}
                      myUser={myUser}
                      selectedIndex={selectedIndex}
                      id="sendChat"
                      data-cy="sendChat"
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Messaging;
