describe("Start and Submit work", () => {
  const gig = 6;
  before(() => {
    cy.setupMetamask("", "kovan", "Tester@1234").then((setupFinished) => {
      expect(setupFinished).to.be.true;
    });
    cy.visit("http://localhost:3000/");
  });
  it(`Freelancer starts work and submits work`, () => {
    // connect account
    cy.switchMetamaskAccount(2).then((switched) => {
      expect(switched).to.be.true;
    });
    // cy.getMetamaskWalletAddress().then((address) => {
    //   expect(address).to.be.equal("0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62");
    // });
    cy.getMetamaskWalletAddress().then((address) => {
      if (address !== "0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62") {
        cy.switchMetamaskAccount(2).then((switched) => {
          expect(switched).to.be.true;
        });
        cy.getMetamaskWalletAddress().then((address) => {
          expect(address).to.be.equal(
            "0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62"
          );
        });
      } else {
        expect(address).to.be.equal(
          "0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62"
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
    // get on the gig page
    cy.get(".bNotifications").click();
    cy.contains(`accepted your proposal`).click();
    cy.get("#bStartWork").click();
    // confirm modal start work
    // cy.get("#bApprove").click();
    // cy.confirmMetamaskTransaction().then((confirmed) => {
    //   expect(confirmed).to.be.true;
    // });
    // cy.get("#eLoader").should("not.be.visible");
    // cy.get("#bWrap").click();
    // cy.confirmMetamaskTransaction().then((confirmed) => {
    //   expect(confirmed).to.be.true;
    // });
    // cy.get("#eLoader").should("not.be.visible");
    // cy.get("#bDeposit").click();
    // cy.confirmMetamaskTransaction().then((confirmed) => {
    //   expect(confirmed).to.be.true;
    // });
    cy.get("#eLoader").should("not.be.visible");
    cy.get("#bConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader").should("not.be.visible");
    cy.get("#bGotoGig").click();
    // submit work
    // cy.get("#bSubmissionTab").click();
    cy.get("#bAddLink").click();
    cy.get("#tLinkName0").type("Example");
    cy.get("#tLinkURL0").type("https://www.google.com/");
    cy.get("#tSubmissionComments").type(`Cypress gig ${gig} submission`);
    cy.get("#bSubmitWork").click();
    //submit work confirm
    cy.get("#bConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader").should("not.be.visible");
    // cy.get("#bGotoGig").click();
  });
});
