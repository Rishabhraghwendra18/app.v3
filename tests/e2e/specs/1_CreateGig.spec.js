describe("Main Flow", () => {
  const gig = 6;
  before(() => {
    cy.setupMetamask("", "kovan", "Tester@1234").then((setupFinished) => {
      expect(setupFinished).to.be.true;
    });
    cy.addMetamaskNetwork({
      networkName: "Polygon Testnet Mumbai",
      rpcUrl: "https://matic-mumbai.chainstacklabs.com",
      chainId: "80001",
      symbol: "MATIC",
      blockExplorer: "https://mumbai.polygonscan.com",
      isTestnet: true,
    }).then((networkAdded) => {
      expect(networkAdded).to.be.true;
    });
    cy.createMetamaskAccount().then((created) => {
      expect(created).to.be.true;
    });
    cy.visit("http://localhost:3000/");
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.acceptMetamaskAccess().then((connected) => {
      expect(connected).to.be.true;
    });
    cy.wait(50);
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
  });
  it(`Initialize Client and create gig`, () => {
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
    cy.wait(3000);
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(1000);
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.wait(3000);
    cy.get("#bNavbarCreateGig").click();
    cy.wait(100);
    // cy.get("#tInitModalUsername").type("anonymous13");
    // cy.get("#tInitModalEmail").type("anonymous13@anony.com");
    // cy.get("#bInitModalSubmit").click();
    // cy.wait(1000);
    // cy.get("#bInitModalYeah").click();
    // cy.wait(2000);
    // cy.get("#bInitModalProfile").click();
    // cy.wait(100);
    // cy.get("#bNavbarCreateGig").click();
    // cy.wait(1000);
    cy.get("#tGigName").type(`Cypress gig ${gig}`);
    cy.get("#tGigDescription").type("Cypress gig description");
    cy.get("#tGigSkills")
      .type("Testing")
      .get('li[data-option-index="0"]')
      .click();
    cy.get("#tGigReward").type("0.01");
    cy.get("#tGigStake").type("0.01");
    cy.get("#tGigDeadline").click();
    cy.wait(1000);
    cy.get(`[aria-label="Jan 13, 2022"]`).click();
    cy.contains("OK").click();
    cy.get("#tGigAcceptance").type("1");
    cy.get("#bCreateGig").click();
    cy.get("#bWrap").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader").should("not.be.visible");
    cy.get("#bCreateGigConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader").should("not.be.visible");
    cy.wait(100);
    cy.get("#bGotoGig").click();
    // cy.wait(4000);
    // cy.contains("Client Brief", { timeout: 4000 });
    // cy.wait(2000);
  });
});
