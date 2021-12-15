import "../app/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import UserProvider from "app/context/web3Context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.MORALIS_APPLICATION_ID || ""}
      serverUrl={process.env.MORALIS_SERVER_ID || ""}
    >
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </MoralisProvider>
  );
}

export default MyApp;
