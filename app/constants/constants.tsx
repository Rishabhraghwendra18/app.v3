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
  { value: "Accounting", label: "Accounting" },
  { value: "Animation", label: "Animation" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Coding", label: "Coding" },
  { value: "Content Writing", label: "Content Writing" },
  { value: "Email Marketing", label: "Email Marketing" },
  { value: "Financial Modeling", label: "Financial Modeling" },
  { value: "Gaming", label: "Gaming" },
  { value: "Go", label: "Go" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Javascript", label: "Javascript" },
  { value: "Marketing", label: "Marketing" },
  { value: "Market Research", label: "Market Research" },
  { value: "Memes", label: "Memes" },
  { value: "Music", label: "Music" },
  { value: "NFT", label: "NFT" },
  { value: "Other", label: "Other" },
  { value: "Photoshop", label: "Photoshop" },
  { value: "Python", label: "Python" },
  { value: "Rust", label: "Rust" },
  { value: "SEO", label: "SEO" },
  { value: "Solidity", label: "Solidity" },
  { value: "Technicl Writing", label: "Technical Writing" },
  { value: "Testing", label: "Testing" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Unity", label: "Unity" },
  { value: "Video Editing", label: "Video Editing" },
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
