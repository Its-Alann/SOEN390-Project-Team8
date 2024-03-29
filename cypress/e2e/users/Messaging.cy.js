/* eslint-disable cypress/no-unnecessary-waiting */
// eslint-disable-next-line import/no-extraneous-dependencies
import "cypress-file-upload";

const messagingTestAccountUid = "9Da7DZCwxRhEKEgC4eQAM1KXQjp1";
const beaUid = "uusviMjzW7P3ehh4r5CCyu9ujvI3";

describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  describe("Testing the messaging feature", () => {
    it("Logins, goes to messaging feature, sends message, sends file, reports message", () => {
      //logout
      cy.logout();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      //login and reach messaging page
      //CONDITION: USER MUST HAVE A CONVERSATION
      cy.login(messagingTestAccountUid);
      cy.visit("http://localhost:3000/messaging");

      //open first conversation and checks if it's visible
      cy.get(".convo-list > .MuiList-root > :nth-child(1)")
        .should("be.visible")
        .click();

      //send Hi message
      cy.get("#message-input").should("be.visible").type("Hi");
      cy.get('[data-cy="send-button"]').should("be.visible").click();
      cy.get("#message-chats").last().should("contain", "Hi");
      cy.wait(1000);

      //send Hi with an emoji
      cy.get("#message-input").should("be.visible").type("Hi");
      cy.get('[data-cy="emojiPickerButton"]').click();
      cy.get('[data-unified="1f602"] > .__EmojiPicker__').click();
      cy.get('[data-testid="SendRoundedIcon"]')
        .should("be.visible")
        .click({ force: true });
      cy.get("#message-chats").last().should("contain", "Hi😂");

      //send image
      const fileName = "src/Assets/fonts/Images/IMG_0524.png";
      cy.wait(1000);
      cy.get('[data-cy="fileUpload"]')
        .find("input")
        .selectFile(fileName, { force: true });

      cy.get('[data-testid="ClearIcon"]').click();

      //send image
      cy.wait(1000);
      cy.get('[data-cy="fileUpload"]')
        .find("input")
        .selectFile(fileName, { force: true });

      cy.get('[data-cy="send-button"]').should("be.visible").click();
      cy.get('[data-testid="messageListItem"]')
        .last()
        .get('[data-testid="attachment"]')
        .last()
        .click();
    });

    // it("report a message", () => {
    //   cy.get(".messageOptions").last().click();
    //   cy.get(".reportMsgButton").click();
    //   cy.get('[data-testid="reportedBadge"]').should("be.visible");
    //   cy.login();
    //   cy.visit("http://localhost:3000/messaging");
    // });

    it("shows message if user is not signed in", () => {
      cy.logout();
      cy.visit("http://localhost:3000/messaging");
    });

    it("shows nothing if user has no conversation", () => {
      //CONDITION: USER MUST HAVE NO CONVERSATION
      //sjMRME25ceRusKoIEmN1jVcwF4F2 accountcreation@test2.com
      cy.login("sjMRME25ceRusKoIEmN1jVcwF4F2");
      cy.visit("http://localhost:3000/messaging");
    });
  });

  describe("Testing the phone resolution changes", () => {
    it("displays icon of returning to all convos when using phone resolution", () => {
      cy.logout();
      cy.login(messagingTestAccountUid);

      //Iphone resolution
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000/messaging");

      //open first conversation and checks if it's visible
      cy.get(".convo-list > .MuiList-root > :nth-child(1)")
        .should("be.visible")
        .click();

      //check if return button is present
      cy.get("#ChevronIcon").should("be.visible").click();
    });

    it("opens messaging of an account wihout a profile", () => {
      cy.logout();
      //CONDITION: USER WITHOUT A PROFILE
      cy.login("sjMRME25ceRusKoIEmN1jVcwF4F2");
    });
  });

  describe("Starting a new conversation", () => {
    // after(() => {
    //   cy.log("yurrr");
    //   cy.callFirestore("get", "messages", {
    //     where: ["authors", "==", ["billybob@gmail.com", "messaging@test.com"]],
    //   }).then((r) => {
    //     const idToDelete = r[0].id;
    //     const pathToDelete = `messages/${idToDelete}`;
    //     cy.log("pathToDelete", pathToDelete);
    //     cy.callFirestore("delete", pathToDelete);
    //   });
    // });

    it("reports then unreports message", () => {
      cy.logout();
      cy.login(beaUid);
      cy.visit("http://localhost:3000/messaging");
      cy.get(".convo-list > .MuiList-root > :nth-child(1)")
        .should("be.visible")
        .click();

      cy.get(".messageOptions").last().invoke("show").click({ force: true });
      cy.get(".reportMsgButton").click();
      cy.get('[data-testid="reportedBadge"]').should("be.visible");

      cy.get(".messageOptions").last().invoke("show").click({ force: true });
      cy.get(".reportMsgButton").click();
      cy.wait(1000);
    });

    it("opens new chat flow", () => {
      cy.logout();
      cy.login(messagingTestAccountUid);
      // cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000/messaging");
      cy.wait(1000);
      cy.get('[data-cy="startNewConvo"]').click();
      cy.get('[data-cy="selectConnections"]').should("be.visible");
      cy.get('[data-cy="submitConnections"]').should("be.disabled");
      cy.get('[data-testid="ArrowDropDownIcon"]').click();
      // cy.get(".MuiAutocomplete-noOptions").should("be.visible");
      cy.get("li.MuiAutocomplete-option").click();
      cy.get('[data-testid="CancelIcon"]').should("be.visible");
      cy.get('[data-cy="submitConnections"]').click();
    });
  });

  // Integration test for firebase connection
});
