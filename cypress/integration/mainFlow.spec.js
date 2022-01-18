describe("Main Flow", () => {
  const gig = new Date().getTime().toString().substring(-5);
  before(() => {
    cy.setupMetamask(
      "shuffle stay hair student wagon senior problem drama parrot creek enact pluck",
      "kovan",
      "Tester@1234"
    ).then((setupFinished) => {
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
    cy.wait(20);
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
  });
  it(`Initialize Client and create gig`, () => {
    cy.changeAccount(1);
    cy.getMetamaskWalletAddress().then((address) => {
      expect(address).to.be.equal("0x352e559B06e9C6c72edbF5af2bF52C61F088Db71");
    });
    cy.wait(1000);
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(2000);
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
    // cy.get("#tGigDeadline").click();
    // cy.get("#tGigDeadline").type("Jan 14, 2022");
    // cy.wait(10000);
    // cy.get(`[aria-label="Jan 14, 2022"]`).click();
    // cy.contains("OK").click();
    cy.get("#tGigAcceptance").type("1");
    cy.get("#bCreateGig").click();
    cy.get("#bWrap").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.get("#bCreateGigConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.wait(3000);
    cy.get("#bGotoGig").click();
    // cy.contains("Client Brief", { timeout: 4000 });
    // cy.wait(2000);
  });
  it(`Initialize freelancer and submit proposal`, () => {
    cy.get("#bNavbarExplore").click();
    cy.changeAccount(2);
    cy.getMetamaskWalletAddress().then((address) => {
      expect(address).to.be.equal("0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62");
    });
    cy.wait(1000);
    // cy.get("#bConnectWallet").click();
    // cy.get("#bMetamaskConnect").click();
    // cy.confirmMetamaskSignatureRequest().then((confirmed) => {
    //   expect(confirmed).to.be.true;
    // });
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(2000);
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
    cy.wait(3000);
    cy.get("#bGotoGig").click();
  });
  it(`Client Accepts proposal first confirmation`, () => {
    cy.wait(1000);
    cy.get("#bNavbarExplore").click();
    cy.wait(1000);
    cy.changeAccount(1);
    cy.getMetamaskWalletAddress().then((address) => {
      expect(address).to.be.equal("0x352e559B06e9C6c72edbF5af2bF52C61F088Db71");
    });
    cy.wait(1000);
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(2000);
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
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.wait(3000);
    cy.get("#bGotoGig").click();
  });
  it(`Freelancer starts work and submits work`, () => {
    cy.wait(1000);
    cy.get("#bNavbarExplore").click();
    cy.wait(1000);
    // connect account
    cy.changeAccount(2);
    cy.getMetamaskWalletAddress().then((address) => {
      expect(address).to.be.equal("0x210B7af5962af8Ab4ac55D5800Ef42e0B0c09e62");
    });
    cy.wait(1000);
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(2000);
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.wait(3000);
    // get on the gig page
    cy.get(".bNotifications").click();
    cy.contains(`accepted your proposal on ${gig}`).click();
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
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.get("#bConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.wait(3000);
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
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.wait(3000);
    cy.get("#bGotoGig").click();
  });
  it(`Client accepts work`, () => {
    cy.wait(1000);
    cy.get("#bNavbarExplore").click();
    cy.wait(1000);
    cy.changeAccount(1);
    cy.getMetamaskWalletAddress().then((address) => {
      expect(address).to.be.equal("0x352e559B06e9C6c72edbF5af2bF52C61F088Db71");
    });
    // cy.wait(3000);
    cy.get("#bAddressInfo").click();
    cy.get("#bLogout").click();
    cy.wait(2000);
    cy.get("#bConnectWallet").click();
    cy.get("#bMetamaskConnect").click();
    cy.confirmMetamaskSignatureRequest().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.wait(3000);
    cy.get(".bNotifications").click();
    cy.contains(`made a submission on Cypress gig ${gig}`).click();
    cy.get("#bAcceptSubmission").click();
    cy.get("#bConfirm").click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
    cy.get("#eLoader", { timeout: 100000 }).should("not.be.visible");
    cy.wait(3000);
    cy.get("#bGotoGig").click();
    cy.wait(1000);
    cy.get("#tGigStatus").contains("Completed");
  });
});
