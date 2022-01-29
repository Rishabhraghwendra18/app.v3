/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    MORALIS_APPLICATION_ID: process.env.MORALIS_APPLICATION_ID,
    MORALIS_SERVER_ID: process.env.MORALIS_SERVER_ID,
    NETWORK_CHAIN: process.env.NETWORK_CHAIN,
    GITHUB_BOT_AUTH: process.env.GITHUB_BOT_AUTH,
  },
};
