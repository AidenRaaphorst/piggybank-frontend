describe("PiggyBank - Login/Logout", () => {
  beforeEach(() => {
    // Visit the login URL
    cy.visit("http://localhost:3000/login");

    // Log into the "Melvin" account
    cy.get("button.login__account").first().click();
  });

  it("is logged into the app using the 'Melvin' account", () => {
    // Confirm the user is logged in as 'Melvin'
    cy.get("h1").should("contain", "Welkom");
    cy.get(".accounts__account-name").should("contain", "Melvin");
  });

  it("logs out of the app", () => {
    // Click the logout button
    cy.get(".app__logout").click();

    // Confirm the user is logged out
    cy.get("h1").should("contain", "Login");
  });
});

describe("PiggyBank - Transactions", () => {
  beforeEach(() => {
    // Login using the 'Cem' account
    cy.visit("http://localhost:3000/login");
    cy.get("button.login__account").eq(2).click();

    // Confirm the user is logged in as 'Cem'
    cy.get("h1").should("contain", "Welkom");
    cy.get(".accounts__account-name").should("contain", "Cem");

    // Navigate to the transfer URL
    cy.visit("http://localhost:3000/transfer");

    // Select the "Sophie" account
    cy.get("select[name=toaccount]").select("4");

    // Add the description
    cy.get("textarea[name=description]").type("This is a test description");
  });

  it("transfers money while balance is higher than 0", () => {
    // Input the amout
    cy.get("input#amount").type("100");

    // Submit the transfer
    cy.get("button[type=submit]").click();

    // Confirm the transfer succeeded
    cy.get("h1").should("contain", "Gelukt");
  });

  it("transfers money while amount is lower than 0", () => {
    // Input the negative amount
    cy.get("input#amount").type("-100");

    // Submit the transfer
    cy.get("button[type=submit]").click();

    // Check if the validation message shows up in the input
    // Bit messy, but it works
    cy.get("input#amount").should("have.attr", "min", "0.00");
  });

  it("transfers money while amount is higher than balance", () => {
    // Input the amount (more than 1000, as that is the starting balance)
    cy.get("input#amount").type("2000");

    // Submit the transfer
    cy.get("button[type=submit]").click();

    // Confirm the transfer succeeded
    cy.get("h1").should("not.contain", "Gelukt");
  });

  it("transfers money in a different currency", () => {
    // Set the currency to USD
    cy.get("select[name=currency]").select("USD");

    // Input the amount
    cy.get("input#amount").type("100");

    // Submit the transfer
    cy.get("button[type=submit]").click();

    // Confirm the transfer succeeded
    cy.get("h1").should("contain", "Gelukt");
    cy.get("div.alert").should("contain", "$");
  });
});

describe("PiggyBank - Settings", () => {
  beforeEach(() => {
    // Login using the '' account
    cy.visit("http://localhost:3000/login");
    cy.get("button.login__account").eq(1).click();
    cy.visit("http://localhost:3000/settings");
  });

  it("Change the account name", () => {
    // Type the new account name
    cy.get("input#accountName").clear().type("Sara’s rekening");

    // TODO: Press the Save button

    // Check new account name
    cy.visit("http://localhost:3000");
    cy.get("div.accounts__account-name").should("have.text", "Sara’s rekening");
  });

  it("Change the account name without input", () => {
    // Type the new account name
    cy.get("input#accountName").clear().type("Sara’s rekening");

    // Click the Save button
    cy.get("button[type=submit]").click();

    // Check new account name
    cy.visit("http://localhost:3000");
    cy.get("div.accounts__account-name").should("have.text", "Sara’s rekening");
  });
});