describe("Accept proposal", () => {
  const gig = 6;
  before(() => {
    cy.setupMetamask("", "kovan", "Tester@1234").then((setupFinished) => {
      expect(setupFinished).to.be.true;
    });
    cy.visit("http://localhost:3000/");
  });
  it(`Client Accepts proposal first confirmation`, () => {
    cy.switchMetamaskAccount(1).then((switched) => {
      expect(switched).to.be.true;
    });
    cy.getMetamaskWalletAddress().then((address) => {
      if (address !== "0x352e559B06e9C6c72edbF5af2bF52C61F088Db71") {
        cy.switchMetamaskAccount(1).then((switched) => {
          expect(switched).to.be.true;
        });
        cy.getMetamaskWalletAddress().then((address) => {
          expect(address).to.be.equal(
            "0x352e559B06e9C6c72edbF5af2bF52C61F088Db71"
          );
        });
      } else {
        expect(address).to.be.equal(
          "0x352e559B06e9C6c72edbF5af2bF52C61F088Db71"
        );
      }
    });
    cy.wait(1000);
    // cy.get("#bAddressInfo").click();
    // cy.get("#bLogout").click();
    // cy.wait(1000);
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.wait(3000);
    cy.get(".bNotifications").click();
    cy.contains(`Cypress gig ${gig}`).click();
    cy.get("#bSelectProposal").click();
    cy.get("#bConfirmAcceptProposal").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader").should("not.be.visible");
    // cy.get("#bGotoGig").click();
  });
});
