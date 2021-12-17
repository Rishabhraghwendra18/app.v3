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
    href: "myProposals",
    icon: IconOne,
    filter: "open",
  },
  /*{
      name: "Received",
      description: "Check out your received proposals",
      href: "##",
      icon: IconTwo,
    },*/
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

function IconOne() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconThree() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
      <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
      <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
      <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
      <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
      <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
    </svg>
  );
}

function metamask() {
  return (
    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28.4231 1.18018L16.7891 9.82018L18.9401 4.72218L28.4231 1.18018Z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.56489 1.18018L13.1049 9.90218L11.0599 4.72218L1.56489 1.18018ZM24.2369 21.2092L21.1389 25.9562L27.7689 27.7802L29.6739 21.3142L24.2369 21.2092ZM0.337891 21.3142L2.23189 27.7802L8.86189 25.9562L5.76189 21.2092L0.337891 21.3142Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.48689 13.1882L6.63989 15.9822L13.2229 16.2752L12.9889 9.20116L8.48689 13.1882ZM21.4999 13.1882L16.9399 9.11816L16.7889 16.2742L23.3599 15.9822L21.4999 13.1882ZM8.86089 25.9562L12.8129 24.0262L9.39989 21.3622L8.86189 25.9572L8.86089 25.9562ZM17.1749 24.0272L21.1379 25.9562L20.5889 21.3612L17.1749 24.0272Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.1391 25.9559L17.1751 24.0259L17.4911 26.6109L17.4551 27.6979L21.1391 25.9559ZM8.86108 25.9559L12.5451 27.6979L12.5211 26.6109L12.8131 24.0269L8.86108 25.9559Z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6029 19.6541L9.30591 18.6841L11.6329 17.6191L12.6029 19.6541ZM17.3849 19.6541L18.3549 17.6191L20.6949 18.6831L17.3849 19.6531V19.6541Z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.86094 25.9559L9.42294 21.2089L5.76294 21.3139L8.86094 25.9559ZM20.5769 21.2089L21.1379 25.9559L24.2369 21.3139L20.5769 21.2089ZM23.3599 15.9819L16.7889 16.2749L17.3969 19.6539L18.3669 17.6189L20.7059 18.6829L23.3599 15.9829V15.9819ZM9.30494 18.6829L11.6429 17.6189L12.6029 19.6539L13.2219 16.2739L6.63894 15.9819L9.30494 18.6829Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.63989 15.9819L9.39989 21.3609L9.30589 18.6829L6.63989 15.9829V15.9819ZM20.7059 18.6829L20.5889 21.3609L23.3599 15.9819L20.7059 18.6829ZM13.2229 16.2739L12.6029 19.6539L13.3749 23.6409L13.5499 18.3909L13.2229 16.2749V16.2739ZM16.7889 16.2739L16.4729 18.3789L16.6129 23.6409L17.3969 19.6539L16.7889 16.2739Z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3969 19.6541L16.6129 23.6411L17.1749 24.0271L20.5889 21.3611L20.7059 18.6831L17.3959 19.6531L17.3969 19.6541ZM9.30591 18.6831L9.39891 21.3611L12.8139 24.0271L13.3739 23.6411L12.6029 19.6541L9.30591 18.6841V18.6831Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4551 27.6981L17.4911 26.6111L17.1981 26.3531H12.7901L12.5211 26.6111L12.5451 27.6981L8.86108 25.9561L10.1481 27.0081L12.7551 28.8211H17.2331L19.8531 27.0081L21.1381 25.9561L17.4551 27.6981Z"
        fill="#C0AD9E"
        stroke="#C0AD9E"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.175 24.0271L16.613 23.6411H13.375L12.813 24.0271L12.521 26.6111L12.79 26.3531H17.198L17.49 26.6111L17.175 24.0271Z"
        fill="#161616"
        stroke="#161616"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.914 10.3822L29.908 5.61118L28.423 1.18018L17.175 9.52818L21.501 13.1882L27.616 14.9772L28.973 13.3982L28.388 12.9782L29.323 12.1242L28.598 11.5622L29.534 10.8492L28.914 10.3822ZM0.092041 5.61118L1.08604 10.3812L0.455041 10.8492L1.39004 11.5622L0.677041 12.1242L1.61204 12.9772L1.02704 13.3982L2.37204 14.9772L8.48704 13.1872L12.813 9.52718L1.56604 1.18018L0.092041 5.61018V5.61118Z"
        fill="#763D16"
        stroke="#763D16"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.6159 14.9772L21.5009 13.1872L23.3609 15.9822L20.5889 21.3612L24.2369 21.3142H29.6739L27.6159 14.9772ZM8.48689 13.1882L2.37189 14.9772L0.337891 21.3142H5.76289L9.39889 21.3612L6.63889 15.9822L8.48689 13.1882ZM16.7889 16.2742L17.1749 9.52817L18.9519 4.72217H11.0599L12.8129 9.52817L13.2229 16.2742L13.3629 18.4022L13.3749 23.6412H16.6129L16.6369 18.4032L16.7889 16.2752V16.2742Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.117"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function walletConnect() {
  return (
    <svg viewBox="0 0 300 185" version="1.1">
      <path
        fill="#3B99FC"
        stroke="none"
        strokeWidth="1"
        fillRule="nonzero"
        d="M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z"
      />
    </svg>
  );
}
