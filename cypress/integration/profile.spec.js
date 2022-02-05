/// <reference types="cypress"/>

describe("Checking all the UI components on Profile Page", () => {
  before(() => {
        cy.setupMetamask(
          "shuffle stay hair student wagon senior problem drama parrot creek enact pluck",
          "kovan",
          "Tester@1234"
        ).then((setupFinished) => {
          expect(setupFinished).to.be.true;
        });
        cy.wait(8000);
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

  // USE THIS BEFORE COMMAND IF ABOVE BEFORE COMMAND FAILS BUT YOU HAVE TO MANUALLY ADD POLYGON TESTNET
  // before(() => {
  //   cy.visit("http://127.0.0.1:3000/");
  //   cy.contains("Connect Wallet").click();
  //   cy.contains("Metamask").click();
  //   cy.wait(10000);
  //   cy.contains("0x352e").click();
  //   cy.contains("Profile").click();
  //   cy.wait(10000); // waiting for the profile to completely load
  // });

  
  it("Profile banner", () => {
    cy.get("[data-testid=banner]").should("exist");
  });
  it("Profile Avatar", () => {
    cy.get("[data-testid=profileAvatar]").should("exist");
  });
  it("Profile Name", () => {
    cy.get("[data-testid=name]").should("exist");
  });
  it("Username", () => {
    cy.get('[data-testid="username"]').should("exist");
    cy.contains("@").should("exist");
  });
  it("Edit Profile Button", () => {
    cy.contains("Edit Profile").should("exist");
  });
  it("Edit Portfolio Button", () => {
    cy.contains("Edit Portfolio").should("exist");
  });
  it("All social media icons", () => {
    cy.get("[data-testid=github]").should("exist");
    cy.get("[data-testid=twitter]").should("exist");
    cy.get("[data-testid=linkdein]").should("exist");
    cy.get("[data-testid=instagram]").should("exist");
    cy.get("[data-testid=discord]").should("exist");
    cy.get("[data-testid=behance]").should("exist");
  });

  it("Joining Date", () => {
    cy.get("[data-testid=joinedOn]").should("exist");
    cy.get("[data-testid=joiningDate]").should("exist");
  });

  it("Description", () => {
    cy.get("[data-testid=description]").should("exist");
  });

  it("Profile tab", () => {
    cy.get("[data-testid=profileTab]").should("exist");
    cy.get("[data-testid=collateral]").should("exist");
    cy.get("[data-testid=collateralAmount]").should("exist");
    cy.get("[data-testid=desposited]").should("exist");
    cy.get("[data-testid=despositedAmount]").should("exist");
    cy.get("[data-testid=gigsCompletedTitle]").should("exist");
    cy.get("[data-testid=NumberOfGigsCompleted]").should("exist");
    cy.get("[data-testid=gigsWorkedTitle]").should("exist");
    cy.get("[data-testid=NumberOfGigsWorked]").should("exist");
    cy.get("[data-testid=successRateTitle]").should("exist");
    cy.get("[data-testid=PercentageSuccessRate]").should("exist");
  });

  it("Deposit Management tab", () => {
    cy.get("[data-testid=depositManagementTab]").should("exist");
    // cy.get('[id="simple-tab-1"]').click(); // cypress issue -> https://github.com/cypress-io/cypress/issues/5826
    // cy.wait(5000);
    // cy.contains('Wrap Matic').should('exist');
    // cy.contains('Unwrap Matic').should('exist');
    // cy.get('[data-testid="collateralLocked"]').should('exist');
    // cy.get('[data-testid="collateralLockedAmount"]').should('exist');
    // cy.get('[data-testid="depositedFunds"]').should('exist');
    // cy.get('[data-testid="depositedFundsAmount"]').should('exist');
    // cy.get('[data-testid="availableFunds"]').should('exist');
    // cy.get('[data-testid="availableFundsAmount"]').should('exist');
    // cy.get('[data-testid="depositManagentDiv"]').should('exist');
    // cy.get('[data-testid="depositManagentAvailableFunds"]').should('exist');
    // cy.get('[data-testid="depositManagentAvailableFundsAmount"]').should('exist');
    // cy.get('[data-testid="depositManagentUnlockFunds"]').should('exist');
    // cy.get('[data-testid="depositManagentUnlockFundsAmount"]').should('exist');
    // cy.contains('Deposit').should('exist');
    // cy.contains('Withdraw').should('exist');
  });

  it("Reviews tab", () => {
    cy.get("[data-testid=reviewsTab]").should("exist");
    cy.get("[data-testid=reviewsTab]").click();
  });
});

describe("Changing User details", () => {
  before(() => {
    cy.visit("http://127.0.0.1:3000/");
    cy.contains("Connect Wallet").click();
    cy.contains("Metamask").click();
    cy.wait(10000);
    cy.contains("0x352e").click();
    cy.contains("Profile").click();
    cy.wait(5000); // waiting for the profile to completely load
    cy.log("Clearning profile form & filling with some dummy data");
    cy.contains("Edit Profile").click();

    cy.get('[data-testid="editName"]').clear();
    cy.get('[data-testid="editName"]').type("xyz");
    cy.get('[title="Clear"]').click({ force: true, multiple: true });
    cy.get('[data-testid="role"]').clear();
    cy.get('[data-testid="role"]').type("xyz111111");
    cy.get('[data-testid="btnsave"]').click();

    cy.get('[data-placeholder="Add bio for your profile"]').clear();
    cy.get('[data-placeholder="Add bio for your profile"]').type(
      "just setting up the test"
    );
    cy.get('[data-testid="bioBtnSave"]').click();

    cy.get('[data-testid="userGithubLink"]').clear();
    cy.get('[data-testid="userLinkdeinLink"]').clear();
    cy.get('[data-testid="userTwitterLink"]').clear();
    cy.get('[data-testid="userInstagramLink"]').clear();
    cy.get('[data-testid="userDiscordLink"]').clear();
    cy.get('[data-testid="userBehanceLink"]').clear();
    cy.get('[data-testid="userPortfolioLink"]').clear();
    cy.get('[data-testid="socialBtnSave"]').click();
    // cy.get('[data-testid="btnExit"]').click();
  });
  beforeEach(()=>{
    cy.fixture("example").then(function (data) {
      this.data = data;
    });
  })
  it("changing profile avatar", () => {
    cy.get('[data-testid="profileAvatarUpload"]').attachFile("logo3.png");
    cy.get('[data-fileName="logo3.png"]').should("exist");
  });

  it("Edit User Profile", function () {
    cy.get("[data-testid=github]").should("not.exist");
    cy.get("[data-testid=twitter]").should("not.exist");
    cy.get("[data-testid=linkdein]").should("not.exist");
    cy.get("[data-testid=instagram]").should("not.exist");
    cy.get("[data-testid=discord]").should("not.exist");
    cy.get("[data-testid=behance]").should("not.exist");

    cy.log("Editing user details");
    cy.contains("Edit Profile").click();

    cy.contains("Personal Info").click();
    cy.get('[data-testid="editName"]').click();
    cy.get('[data-testid="editName"]').clear();
    cy.get('[data-testid="editName"]').type(this.data.name);
    cy.get('[data-testid="skills"]').click();
    cy.contains("Accounting").click();
    cy.get('[data-testid="skills"]').click();
    cy.contains("Blockchain").click();
    cy.get('[data-testid="role"]').click();
    cy.get('[data-testid="role"]').clear();
    cy.get('[data-testid="role"]').type(this.data.role);
    cy.get('[data-testid="organizations"]').click();
    cy.contains("Spect Network").click();
    cy.get('[data-testid="btnsave"]').click();

    cy.get('[data-placeholder="Add bio for your profile"]').click();
    cy.get('[data-placeholder="Add bio for your profile"]').clear();
    cy.get('[data-placeholder="Add bio for your profile"]').type(this.data.bio);
    cy.get('[data-testid="bioBtnSave"]').click();

    cy.get('[data-testid="userGithubLink"]').type(this.data.github);
    cy.get('[data-testid="userLinkdeinLink"]').type(this.data.linkedin);
    cy.get('[data-testid="userTwitterLink"]').type(this.data.twitter);
    cy.get('[data-testid="userInstagramLink"]').type(this.data.instagram);
    cy.get('[data-testid="userDiscordLink"]').type(this.data.discord);
    cy.get('[data-testid="userBehanceLink"]').type(this.data.behance);
    cy.get('[data-testid="userPortfolioLink"]').type(this.data.portfolio);
    cy.get('[data-testid="socialBtnSave"]').click();
    cy.get('[data-testid="btnExit"]').click();

    cy.contains("xyz").should("not.exist");
    cy.contains("xyz111111").should("not.exist");
    cy.contains("just setting up the test").should("not.exist");
    cy.contains("hello@cypress.io").should("exist");
    cy.contains(
      "Fixtures are a great way to mock data for responses to routes. This is an example description for testing only"
    ).should("exist");
    cy.contains("Accounting").should("exist");
    cy.contains("Blockchain").should("exist");

    cy.get("[data-testid=github]").should("exist");
    cy.get("[data-testid=twitter]").should("exist");
    cy.get("[data-testid=linkdein]").should("exist");
    cy.get("[data-testid=instagram]").should("exist");
    cy.get("[data-testid=discord]").should("exist");
    cy.get("[data-testid=behance]").should("exist");
    cy.get(`[href="${this.data.github}"]`).should("exist");
    cy.get(`[href="${this.data.linkedin}"]`).should("exist");
    cy.get(`[href="${this.data.twitter}"]`).should("exist");
    cy.get(`[href="${this.data.instagram}"]`).should("exist");
    cy.get(`[href="https://discordapp.com/channels/@me/${this.data.discord}/"]`).should("exist");
    cy.get(`[href="${this.data.portfolio}"]`).should("exist");
  });

  it("Deleting Existing Portfolios",()=>{
    cy.contains("Edit Portfolio").click();
    cy.get('[data-testid="btnDeletePortfolio"]').click({ force: true, multiple: true });
    cy.get('[data-testid="btnSavePortfolio"]').click();
  })
  it("Adding Portfolios",function(){
    cy.get(`[href="${this.data.portfolio2}"]`).should("not.exist");

    cy.contains("Edit Portfolio").click();
    cy.get('[data-testid="btnAddPortfolio"]').click();

    cy.get('[data-testid="portfolioName"]').type("ExPortfolio");
    cy.get('[data-testid="portfolioLink"]').type(this.data.portfolio2);
    cy.get('[data-testid="portfolioThumbnail"]',{timeout:5*1000}).attachFile("logo3.png");
    cy.wait(4000);
    cy.get('[data-testid="btnSavePortfolio"]').click();

    cy.get(`[href="${this.data.portfolio2}"]`).should("exist");
  })
});
