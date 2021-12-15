import "../app/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID || ""}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_ID || ""}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
