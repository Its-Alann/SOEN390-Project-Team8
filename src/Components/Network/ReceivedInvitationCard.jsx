/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { ref, getDownloadURL } from "firebase/storage";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { PropTypes } from "prop-types";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey, blue } from "@mui/material/colors";
import {
  getDoc,
  doc,
  arrayRemove,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../Firebase/firebase";

const theme2 = createTheme({
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

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: "#EAEAEA",
  backgroundColor: "#2B2F90",
  "&:hover": {
    backgroundColor: "#2B2F60",
  },
}));

const ColorButtonLightBlue = styled(Button)(({ theme }) => ({
  color: "#2B2F90",
}));

export const ReceivedInvitationCard = ({
  allUserProfiles,
  receivedInvitationUserID,
  currentUser,
}) => {
  const [receivedInvitationUser, setReceivedInvitationUser] = useState([]);
  const { t, i18n } = useTranslation();
  const [imageUrl, setImageUrl] = useState({});

  const getProfilePicture = async () => {
    //Get profile picture
    console.log(receivedInvitationUserID);
    const profilePictureLink = `${receivedInvitationUserID}-profilePicture`;
    const imageRef = ref(storage, `profile-pictures/${profilePictureLink}`);
    getDownloadURL(imageRef)
      // eslint-disable-next-line no-shadow
      .then((imageUrl) => {
        setImageUrl(imageUrl);
      })
      .catch((error) => {
        setImageUrl(null);
        console.log(error.message, "error getting the image url");
      });
  };

  useEffect(() => {
    const findReceivedInviteUserProfile = allUserProfiles.find(
      (el) => el.id === receivedInvitationUserID
    );
    // console.log(findConnectUserProfile);
    setReceivedInvitationUser(findReceivedInviteUserProfile);
    getProfilePicture();
  }, [allUserProfiles, receivedInvitationUserID]);

  const ignoreInvite = async () => {
    // 1. remove user from invitations.requestUsers collection
    // 2. refresh page to remove user card
    const currentUserReceivedInvitationsRef = doc(
      db,
      "invitations",
      currentUser
    );
    const userSentInvitationRef = doc(
      db,
      "invitations",
      receivedInvitationUserID
    );

    try {
      await updateDoc(currentUserReceivedInvitationsRef, {
        receivedInvitations: arrayRemove(receivedInvitationUserID),
      });

      await updateDoc(userSentInvitationRef, {
        sentInvitations: arrayRemove(currentUser),
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const acceptInvite = async () => {
    //curent user references
    const currentUserInvitationRef = doc(db, "invitations", currentUser);
    const currentUserNetworkRef = doc(db, "network", currentUser);

    // sent/received invitation user reference
    const userSentInvitiationRef = doc(
      db,
      "invitations",
      receivedInvitationUserID
    );
    const userSentInvitationNetworkRef = doc(
      db,
      "network",
      receivedInvitationUserID
    );

    try {
      //remove received invitation from current user array
      await updateDoc(currentUserInvitationRef, {
        receivedInvitations: arrayRemove(receivedInvitationUserID),
      });
      //add user that sent the invitation to current user network
      await updateDoc(currentUserNetworkRef, {
        connectedUsers: arrayUnion(receivedInvitationUserID),
      });

      //remove current user from the sent invitation array of the user that send the invitation
      await updateDoc(userSentInvitiationRef, {
        sentInvitations: arrayRemove(currentUser),
      });
      //add current user that to the network of the user sent the invitation
      await updateDoc(userSentInvitationNetworkRef, {
        connectedUsers: arrayUnion(currentUser),
      });

      // Add notification for user being accepted
      const userSentInvitationNotificationsRef = doc(
        db,
        "notifications",
        receivedInvitationUserID
      );
      let userSentInvitationNotificationsSnap = await getDoc(
        userSentInvitationNotificationsRef
      );

      // Check if the document exists
      if (userSentInvitationNotificationsSnap.exists()) {
        console.log("Notification document exists for this user");
      } else {
        console.log("Notification document exists for this user");
        console.log("Creating notification document for this user!");
        // Add user email to notifications collection
        await setDoc(doc(db, "notifications", receivedInvitationUserID), {
          notifications: [],
          notificationForJobs: true,
          notificationForConnections: true,
        });
        userSentInvitationNotificationsSnap = await getDoc(
          userSentInvitationNotificationsRef
        );
      }
      // Check if the user receiving the notification has the setting turned on
      if (
        userSentInvitationNotificationsSnap.data()
          .notificationForConnections === true
      ) {
        const currentUserRef = doc(db, "userProfiles", currentUser);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentDate = new Date();
        await updateDoc(userSentInvitationNotificationsRef, {
          notifications: arrayUnion(
            ...[
              {
                type: "connections",
                content: `${currentUserSnap.data().values.firstName} ${
                  currentUserSnap.data().values.lastName
                } accepted your invitation request`,
                timestamp: currentDate,
              },
            ]
          ),
        });
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {receivedInvitationUser ? (
        <ThemeProvider theme={theme2}>
          <div>
            <Box sx={{ width: 300, minWidth: 100 }}>
              <Card variant="outlined" sx={{ p: 1 }} data-cy="ReceivedCard">
                <>
                  <CardHeader
                    avatar={
                      //source will be the user's image
                      <Avatar
                        aria-label="user"
                        sx={{ width: 56, height: 56 }}
                        src={imageUrl}
                      />
                    }
                    //title will be the user's name and subheader is their bio
                    title={
                      receivedInvitationUser.values.firstName !== "" &&
                      receivedInvitationUser.values.lastName !== ""
                        ? `${receivedInvitationUser.values.firstName} ${receivedInvitationUser.values.lastName}`
                        : "No name"
                    }
                    subheader={
                      //remove != null when incomplete users are removed
                      receivedInvitationUser.values.description !== "" &&
                      receivedInvitationUser.values.description != null
                        ? receivedInvitationUser.values.description.length <= 24
                          ? `${receivedInvitationUser.values.description}`
                          : `${receivedInvitationUser.values.description.substring(
                              0,
                              21
                            )} ...`
                        : "No bio"
                    }
                  />
                  {/*moves the buttons to the right*/}
                  <Box display="flex" justifyContent="flex-end">
                    <CardActions>
                      {/*view profile will go to the user's profile and message will be sent to the */}
                      <ColorButtonBlue
                        size="medium"
                        onClick={acceptInvite}
                        data-cy={`AcceptInvitationBtn${
                          receivedInvitationUser?.values?.firstName ?? ""
                        }`}
                        id={`AcceptInvitationBtn${
                          receivedInvitationUser?.values?.firstName ?? ""
                        }`}
                      >
                        {t("Accept")}
                      </ColorButtonBlue>
                      <ColorButtonLightBlue
                        size="medium"
                        variant="outlined"
                        onClick={ignoreInvite}
                        data-cy={`IgnoreInvitationBtn${
                          receivedInvitationUser?.values?.firstName ?? ""
                        }`}
                        id={`IgnoreInvitationBtn${
                          receivedInvitationUser?.values?.firstName ?? ""
                        }`}
                      >
                        {t("Ignore")}
                      </ColorButtonLightBlue>
                    </CardActions>
                  </Box>
                </>
              </Card>
            </Box>
          </div>
        </ThemeProvider>
      ) : null}
    </>
  );
};

ReceivedInvitationCard.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  receivedInvitationUserID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default ReceivedInvitationCard;
