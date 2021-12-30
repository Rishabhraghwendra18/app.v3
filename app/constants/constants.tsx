import { IconOne, IconThree, IconTwo, metamask, walletConnect } from "./icons";

export const gigs = [
  {
    name: "Created",
    description: "Check out your created gigs which are yet to start",
    href: "myGigs?status=myCreated",
    icon: IconOne,
  },
  {
    name: "In progress",
    description: "See your gigs that have started",
    href: "myGigs?status=myActive",
    icon: IconThree,
  },
  {
    name: "In Review",
    description: "Check gigs waiting for your review",
    href: "myGigs?status=myInReview",
    icon: IconTwo,
  },
  {
    name: "Completed",
    description: "Check out your completed gigs",
    href: "myGigs?status=myCompleted",
    icon: IconOne,
  },
];

export const proposals = [
  {
    name: "Submitted",
    description: "Check out your sent proposals",
    href: "myProposals?status=open",
    icon: IconOne,
  },
];

export const profile = [
  {
    name: "Profile",
    href: "/profile",
  },
  {
    name: "Logout",
    href: "/",
    authenticate: 3,
  },
];

export const wallets = [
  {
    name: "Metamask",
    icon: metamask,
    description: "The most common wallet used",
    authenticate: 1,
    href: "",
  },
  {
    name: "WalletConnect",
    icon: walletConnect,
    description: "The new age wallet",
    authenticate: 2,
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

export const selectStyleDark = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    border: "0",
    boxShadow: "none",
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "#5a6972",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      margin: "0",
      padding: "0",
    };
  },
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "black" : "#99ccff",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#000f29",
    boxShadow: "none",
    border: "1px solid #0061ff",
  }),
};

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
};

export const proposalHelperTexts = {
  title: "The proposal title, make it brief",
  minStake:
    "Collateral is locked by you to ensure high quality of work. Client will be compensated from this amount in case the gig is failed.",
  deadline:
    "The date by which you can submit the work. This deadline can be earlier or later than client preferred deadline.",
};

export const submissionHelperTexts = {
  name: "The name of the link ex. Github PR, Figma wireframe etc.",
  link: "URL of the link you want to submit",
  file: "If required, upload a zip with all the the necessary files.",
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
  401: "Delist",
  402: "Submission Violation",
  403: "Dispute",
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
};

export const statusIdToStatusMap = {
  101: "myCreated",
  201: "myActive",
  202: "myInReview",
  203: "myCompleted",
  402: "myViolations",
  403: "myDisputed",
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
