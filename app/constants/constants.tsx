import {
  CompletedIcon,
  InProgressIcon,
  InReviewIcon,
  CreatedIcon,
  metamask,
  walletConnect,
} from "./icons";

export const gigs = [
  {
    name: "Created",
    description: "Check out your created gigs which are yet to start",
    href: "/myGigs?status=myCreated",
    icon: CreatedIcon,
    id: "bMyCreatedGigs",
  },
  {
    name: "In progress",
    description: "See your gigs that have started",
    href: "/myGigs?status=myActive",
    icon: InProgressIcon,
    id: "bMyInProgressGigs",
  },
  {
    name: "In Review",
    description: "Check gigs waiting for your review",
    href: "/myGigs?status=myInReview",
    icon: InReviewIcon,
  },
  {
    name: "Completed",
    description: "Check out your completed gigs",
    href: "/myGigs?status=myCompleted",
    icon: CompletedIcon,
  },
];

export const proposals = [
  {
    name: "Submitted",
    description: "Check out your sent proposals",
    href: "/myProposals?status=open",
    icon: CreatedIcon,
  },
];

export const profile = [
  {
    name: "Profile",
    href: "/profile",
    id: "bProfile",
  },
  {
    name: "Logout",
    href: "/",
    authenticate: 3,
    id: "bLogout",
  },
];

export const wallets = [
  {
    name: "Metamask",
    icon: metamask,
    description: "The most common wallet used",
    authenticate: 1,
    href: "",
    id: "bMetamaskConnect",
  },
  {
    name: "WalletConnect",
    icon: walletConnect,
    description: "Coming soon",
    // authenticate: 2,
    href: "",
  },
];

export const skillOptions = [
  { label: "Accounting" },
  { label: "Animation" },
  { label: "Blockchain" },
  { label: "Coding" },
  { label: "Content Writing" },
  { label: "Email Marketing" },
  { label: "Financial Modeling" },
  { label: "Gaming" },
  { label: "Go" },
  { label: "Graphic Design" },
  { label: "Javascript" },
  { label: "Marketing" },
  { label: "Market Research" },
  { label: "Memes" },
  { label: "Music" },
  { label: "NFT" },
  { label: "Other" },
  { label: "Photoshop" },
  { label: "Python" },
  { label: "Rust" },
  { label: "SEO" },
  { label: "Solidity" },
  { label: "Technical Writing" },
  { label: "Testing" },
  { label: "UI/UX Design" },
  { label: "Unity" },
  { label: "Video Editing" },
];

export const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  ["bold", "italic", "underline"], // toggled buttons
  ["blockquote", "code-block", "link", "image", "video"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["clean"], // remove formatting button
];

export const modules = {
  toolbar: toolbarOptions,
};

export const gigHelperTexts = {
  name: "The gig name (duh!)",
  reward:
    "Reward will be escrowed while the gig is listed and paid to freelancer on completion.",
  minStake:
    "Collateral is locked by freelancer to ensure high quality of work. You will be compensated from this amount in case the gig is failed.",
  deadline:
    "The tentative date by which you want the submission. This deadline is finalized after you accept a proposal.",
  acceptanceDays:
    "The number of days after the submission deadline you need to review the work.",
  tags: "Skills the freelancer would need to have to complete the gig successfully.",
  description:
    "Describe the gig thoroughly. You can use images, embed videos etc. Make it as clear as possible.",
  skills:
    "Skills the freelancer would need to have to complete the gig successfully.",
  revisions:
    "How many minimum number of revisions do you expect from the freelancer",
  timeToRevise:
    "How much time do you want to give the freelancer to submit a new revision",
};

export const proposalHelperTexts = {
  title: "The proposal title, make it brief",
  minStake:
    "Collateral is locked by you to ensure high quality of work. Client will be compensated from this amount in case the gig is failed.",
  deadline:
    "The date by which you can submit the work. This deadline can be earlier or later than client preferred deadline.",
  revisions: "How many number of revisions do you want to offer",
  timeToRevise:
    "How much time will you take to submit a new revision after it is requested from the client",
};

export const submissionHelperTexts = {
  name: "The name of the link ex. Github PR, Figma wireframe etc.",
  link: "URL of the link you want to submit",
  file: "If required, upload a zip with all the the necessary files.",
};

export const exploreHelperTexts = {
  skills: "Filter gigs based on the skills required to complete them",
  minStake:
    "Collateral is locked by you before starting gig to ensure high quality of work.",
  deadline: "The date by which you have to submit work.",
};

export const profileHelperTexts = {
  name: "Your name I guess",
  username: "This is your username",
  email: "This is the email where we will send you notifications",
  skills: "Add the skills you have which will be seen by potential clients",
  title: "A role in an organization or in life that describes you the best",
  organization:
    "The gigs you post will be from this organization once your membership is verified",
  minStake:
    "Collateral is locked by you before starting gig to ensure high quality of work",
  deposit: "The total WMatic deposited on our platform",
  available: "Available Wmatic free to deposit",
  unlocked: "Total WMatic available for you to withdraw",
};

export const monthMap = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "June",
  6: "July",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export const gigStatusMapping = {
  101: "Open",
  102: "Awaiting freelancer confirmation",
  201: "Work Started",
  202: "In review",
  203: "Completed",
  204: "Revision requested",
  401: "Deleted",
  402: "Submission Violation",
  403: "In Dispute",
  404: "Expired",
};

export const proposalStatusMapping = {
  101: "Open",
  102: "Shortlisted",
  103: "Selected",
  401: "Rejected",
};

export const statusToStatusIdMap = {
  myCreated: 101,
  myActive: 201,
  myInReview: 202,
  myCompleted: 203,
  myViolations: 402,
  myDisputed: 403,
  myDelisted: 401,
  open: 101,
  shortlisted: 102,
  accepted: 103,
  rejected: 401,
};

export const statusIdToStatusMap = {
  101: "myCreated",
  201: "myActive",
  202: "myInReview",
  203: "myCompleted",
  402: "myViolations",
  403: "myDisputed",
  401: "myDelisted",
};

export const proposalStatusIdToStatusMap = {
  100: "all",
  101: "open",
  102: "shortlisted",
  103: "accepted",
  401: "rejected",
};

export const actionIdToTabMap = {
  0: 1,
  1: 3,
  2: 0,
  3: 5,
  6: 6,
};

export const animationVariant = {
  hidden: {
    opacity: 0,
    x: 0,
    y: 100,
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 0,
    y: 100,
    transition: {
      duration: 0.5,
    },
  },
};

export const chainIdMapping = {
  mumbai: "0x13881",
  polygon: "0x89",
};

export const chainIdMappingDecimal = {
  mumbai: "80001",
  polygon: "137",
};

export const chainRPC = {
  mumbai:
    "https://speedy-nodes-nyc.moralis.io/f84f46508f22a737cbbdb355/polygon/mumbai",
  polygon: "https://polygon-rpc.com/",
};

export const chainNameMapping = {
  mumbai: "Polygon Mumbai testnet",
  polygon: "Polygon Mainnet",
};

export const formStep = 1;
