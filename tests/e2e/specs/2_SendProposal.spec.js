describe("Send proposal", () => {
  const gig = 6;
  before(() => {
    cy.setupMetamask("", "kovan", "Tester@1234").then((setupFinished) => {
      expect(setupFinished).to.be.true;
    });
    cy.visit("http://localhost:3000/");
  });
  it(`Initialize freelancer and submit proposal`, () => {
    cy.switchMetamaskAccount(2).then((switched) => {
      expect(switched).to.be.true;
    });
    // cy.switchMetamaskAccount(2).then((switched) => {
    //   expect(switched).to.be.true;
    // });
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
    // cy.get("#bConnectWallet").click();
    // cy.get("#bMetamaskConnect").click();
    // cy.confirmMetamaskSignatureRequest().then((confirmed) => {
    //   expect(confirmed).to.be.true;
    // });
    // cy.get("#bAddressInfo").click();
    // cy.get("#bLogout").click();
    // cy.wait(1000);
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.wait(3000);
    cy.contains(`Cypress gig ${gig}`).click();
    // cy.wait(2000);
    cy.get("#bSubmitProposal").click();
    cy.get("#tProposalTitle").type(`Proposal gig ${gig} `);
    cy.get("#tProposalForm").type("Proposal Form cypress");
    cy.get("#bSendProposal").click();
    cy.wait(1000);
    cy.get("#bConfirmProposal").click();
    cy.wait(2000);
  });
});
