import React from "react";
import SignUp from "./SignUp";

describe("<SignUp />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SignUp />);
  });

  beforeEach(() => {
    cy.mount(<SignUp />);
  });

  it("shows helper text when typing a wrong email", () => {
    cy.get("#email").type("email@test");
    cy.get("input").tab();
    cy.get('[data-cy="emailTest"]').contains("Please enter a valid email");
  });
});
