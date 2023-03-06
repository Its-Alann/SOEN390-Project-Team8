/* eslint-disable cypress/no-unnecessary-waiting */
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {
  doc,
  updateDoc as update,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  FieldValue,
} from "firebase/firestore";
import { db } from "../../src/Firebase/firebase";

Cypress.on("uncaught:exception", (err, runnable) => false);

async function AsyncRemoveSentInvitation(RemoveAcc, fromAcc) {
  const sentInvitationsRef = doc(db, "invitations", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(sentInvitationsRef, {
    sentInvitations: arrayRemove(RemoveAcc),
  });
}

//async function to remove a received invitation
async function AsyncRemoveReceivedInvitation(RemoveAcc, fromAcc) {
  const receivedInvitationsRef = doc(db, "invitations", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(receivedInvitationsRef, {
    receivedInvitations: arrayRemove(RemoveAcc),
  });
}
//reference to document network and element accountcreation@test.com

//async function to remove connected user accountcreation@test.com from hypeboy@tok.ki
async function AsyncRemoveConnectedUser(RemoveAcc, fromAcc) {
  const connectedUsersRef = doc(db, "network", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(connectedUsersRef, {
    connectedUsers: arrayRemove(RemoveAcc),
  });
}

describe("Testing the networking features of the app", () => {
  //async function to remove a sent invitation to

  //No received invitations yet :/
  //No sent invitations :/
  //No connections yet :/

  describe("Testing the invitation feature between hypeboy and accountcreation@test by sending the invitation from hypeboy to accountcreation@test and ignoring it on accountcreation", () => {
    it("removes the SENT invitation if present, removes the connection between the two accounts if present", () => {
      //logout and login to hypeboy@tok.ki account
      cy.visit("http://localhost:3000/network");
      cy.logout();
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");
      cy.wait(2000);

      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );
    });

    it("Switch to Received Invitations, logs in to hypeboy, verifies the invitation button is present", () => {
      //fails when tabs are empty, loign uid gives problems
      cy.logout();

      //List of accounts
      //"g7aTo5gtRCYjx3ggCJLOWnxVRFp2" hypeboy@tok.ki
      //CqtAL3huXbQyo0ZAHNcRkvWbfBc2 billybob@gmail.com
      //sjMRME25ceRusKoIEmN1jVcwF4F2 accountcreation@test2.com
      //fZ54oR1iGTfwThreKpnuklsV5JC2 aliceykchen01@gmail.com
      //QdFFUPgmxrdGl8IT72Jgm1Ooc6p2 accountcreation@test.com

      //Go to hypeboy's account
      const uid = "g7aTo5gtRCYjx3ggCJLOWnxVRFp2";
      //login to hypeboy's account
      cy.login(uid);
      cy.visit("http://localhost:3000/network");

      //click on view profile of the first user
      //needs to be modified
      cy.get(
        ":nth-child(2) > :nth-child(1) > .MuiContainer-root > .css-12ke8jn > .MuiGrid-container > :nth-child(1) > :nth-child(1) > .css-nwqh5 > .MuiPaper-root > .MuiBox-root > .MuiCardActions-root > .MuiButton-text"
      ).click();

      //switch to sent and received invitations tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();

      //visit network and check if invitation button exists
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
      cy.get('[data-cy="invitationButton"]').should("be.visible");
    });

    it("removes the RECEIVED invitation of hypeboy from accountcreation and the connection between the two accounts", () => {
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
      cy.get('[data-cy="invitationButton"]').click();

      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveReceivedInvitation(
          "hypeboy@tok.ki",
          "accountcreation@test.com"
        )
      );
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );
    });

    it("sends the invitation from hypeboy's account", () => {
      //send invitation
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
      cy.get('[data-cy="invitationButton"]').click();
      cy.wait(500);
    });

    it("logs out, logs in to accountcreation, click on ignore invitation", () => {
      cy.logout();
      //login to accountcreation@test.com
      cy.login("QdFFUPgmxrdGl8IT72Jgm1Ooc6p2");
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();

      //IgnoreInvitationBtn
      cy.get('[data-cy="IgnoreInvitationBtn"]').click();
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      cy.get('[data-cy="NetworkTab"]').click();
    });

    it("logs out, logs in to hypeboy, visit all tabs", () => {
      //logout and login to hypeboy@tok.ki account
      cy.logout();
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist network page and all tabs
      cy.visit("http://localhost:3000/network");
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      cy.get('[data-cy="NetworkTab"]').click();
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
    });
  });

  describe("Testing the invitation feature between hypeboy and accountcreation@test by sending the invitation from hypeboy to accountcreation@test and withdrawing it from hypeboy", () => {
    it("removes the SENT invitation if present, removes the connection between the two accounts if present", () => {
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );
    });

    it("logs in to hypeboy and check if the invitation button is present and click on it", () => {
      //login to hypeboy@tok.ki account
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist network
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();

      //send invitation
      cy.get('[data-cy="invitationButton"]').should("be.visible").click();
      cy.wait(1000);
      //WEIRD CYPRESS BUG: TEST MUST END AFTER INVITATION CLICK FOR IT TO TAKE EFFECT
    });

    it("withdraws the invitation that was sent from the right account", () => {
      //vist network page and all tabs
      cy.visit("http://localhost:3000/network");
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      //verify that last user is the user we sent the invitation to (could be modified to a find if last invitation != last user that appears)
      //name of the user is "Test User"
      cy.wait(1000);
      if (
        cy.get('[data-cy="invitationsGrid"]').last("Grid").contains("Test User")
      ) {
        cy.get('[data-cy="invitationsGrid"]')
          .last("Grid")
          .within(() => cy.get("#withdrawButton").click());
      }
    });
  });

  describe("Testing the invitation feature between hypeboy and accountcreation@test by sending the invitation from hypeboy to accountcreation@test and accepting it on accountcreation", () => {
    it("removes the RECEIVED and SENT invitation if present, removes the connection between the two accounts if present", () => {
      //remove RECEIVED invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveReceivedInvitation(
          "hypeboy@tok.ki",
          "accountcreation@test.com"
        )
      );

      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );

      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );
    });

    it("logs out, logs in to hypeboy, sends invitation if button present", () => {
      cy.logout();
      //login to hypeboy@tok.ki account
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist page
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();

      //send invitation
      cy.get('[data-cy="invitationButton"]').click();
      cy.wait(500);
      //WEIRD CYPRESS BUG: TEST MUST END AFTER INVITATION CLICK FOR IT TO TAKE EFFECT
    });

    it("visits the page again to ensure the user is not present on possible connections anymore", () => {
      //visit Possible Connections Tab and check if correct message exists
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
      cy.get(".MuiContainer-maxWidthXxl > .MuiBox-root").contains(
        "No connections yet :/"
      );
    });

    it("verifies the invitation was sent", () => {
      //visit all tabs
      cy.visit("http://localhost:3000/network");
      cy.get(".MuiContainer-maxWidthXxl > .MuiBox-root").contains(
        "No connections yet :/"
      );

      //visit sent invitation tab and Possible Connections Tab
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="PossibleConnectionsTab"]').click();
    });

    it("logs out, logs in to createaccount containing the invitation and accepts it", () => {
      //logout, login to createaccount, accept invitation
      cy.logout();
      cy.login("QdFFUPgmxrdGl8IT72Jgm1Ooc6p2");
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      //Gives problems at times, especially when not last action in test
      cy.get('[data-cy="AcceptInvitationBtn"]').should("be.visible").click();
      cy.wait(1000);

      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
    });

    it("verify user has been added to the network once added", () => {
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="NetworkTab"]').click();
      //check if profile exists
      cy.get('[data-cy="userProfileInNetwork"]').findByText("Hanni Pham");
    });
  });
});