import React from "react";
import App from "../../src/App";

describe("<App />", () => {
  it("it renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<App />);
  });
});
