/* eslint-disable no-unused-expressions */
/* eslint-disable cypress/no-unnecessary-waiting */
import { expect } from "chai";
import {
  onAuthStateChanged,
  deleteUser,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../../src/Firebase/firebase";

const deleteSignedUser = async (password) => {
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    password
  );

  const result = await reauthenticateWithCredential(
    auth.currentUser,
    credential
  );

  // Pass result.user here
  await deleteUser(result.user);

  console.log("success in deleting");
  localStorage.removeItem("user");
};

describe("Testing the login feature", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.logout();
  });

  describe("Testing the form, form validation and the helper texts", () => {
    it("Loads the sign up form", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.get("#email").should("be.visible");
      cy.get("#password").should("be.visible");
      cy.get("#submitBtn").should("be.visible");
    });

    it("shows helper text with wrong email format", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.get("#email").type("abc@abc");
      cy.get("#password").focus();
      cy.get("#email-helper-text").should("include.text", "valid email");
    });

    it("shows helper text with wrong email format", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.get("#email").type("abc@abc");
      cy.get("#password").focus();
      cy.get("#email-helper-text").should("include.text", "valid email");
    });

    it("shows helper text when typing a wrong password", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.get("#password").type("123546");
      cy.get("#email").focus();
      cy.get("#password-helper-text").contains("Please enter a password");
    });
  });

  describe("Testing signing up api calls (IMPORTANT:new@user.com MUST NOT EXIST)", () => {
    it("throws error when submitting with existing email", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.get("#email").type("sam@sung.com");
      cy.get("#password").type("Email123!");
      cy.wait(3000);
      //intercept API call
      cy.intercept({
        method: "POST",
      }).as("responseRole");
      cy.get("#submitBtn").click();
      // and wait for cypress to get the result as alias
      cy.wait(1000);
      cy.wait("@responseRole").then(({ request, response }) => {
        //console.log(request.body);
        expect(response.body.error.code).to.equal(400);
        expect(response.body.error.message).to.equal("EMAIL_EXISTS");
      });
    });

    //Needs to be replaced with jest unit tests
    /*
    //IMPORTANT TO CHECK THAT THE ACCOUNT DOESN'T EXIST ALREADY
    it("creating account when using valid information and verify it's logged in", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.logout();
      cy.get("#firstName").type("New");
      cy.get("#lastName").type("User");
      cy.get("#email").type("new@user.com");
      cy.get("#password").type("Email123!");

      //intercept API call
      cy.intercept({
        method: "POST",
      }).as("responseRole");
      cy.get("#submitBtn").click();
      // and wait for cypress to get the result as alias
      cy.wait("@responseRole").then(({ request, response }) => {
        expect(response.body.error).to.equal(undefined);
      });
      cy.wait(500);
    });

    it("verifies account has been created and logged in then delete it", () => {
      cy.wait(1000);
      expect(auth.currentUser.email).to.equal("new@user.com");
      deleteSignedUser("Email123!");
    });

    it("creating account when using valid information and clicking somewhere else while submitting", () => {
      cy.visit("http://localhost:3000/SignUp");
      cy.logout();
      cy.get("#firstName").type("New");
      cy.get("#lastName").type("User");
      cy.get("#email").type("new@user.com");
      cy.get("#password").type("Email123!");

      //intercept API call
      cy.intercept({
        method: "POST",
      }).as("responseRole");
      cy.get("#submitBtn").click();
      cy.get(".css-1t6c9ts > :nth-child(3)").click();
      // and wait for cypress to get the result as alias
      cy.wait("@responseRole").then(({ request, response }) => {
        expect(response.body.error).to.equal(undefined);
      });
      cy.wait(500);
    });

    it("verifies account has been created and logged in then delete it", () => {
      cy.wait(1000);
      expect(auth.currentUser.email).to.equal("new@user.com");
      deleteSignedUser("Email123!");
    });*/
  });
});
