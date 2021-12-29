import "../app/styles/globals.css";
import "../app/styles/quill.bubble.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import GlobalProvider from "app/context/web3Context";
import { createTheme, ThemeProvider } from "@mui/material";
import Script from "next/script";
import { muiTheme } from "app/constants/muiTheme";
import { Layout } from "app/components/layouts";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  let theme = createTheme(muiTheme);
  const router = useRouter();
  const url = `localhost:3000/${router.route}`;
  return (
    <MoralisProvider
      appId={process.env.MORALIS_APPLICATION_ID || ""}
      serverUrl={process.env.MORALIS_SERVER_ID || ""}
    >
      <GlobalProvider>
        <ThemeProvider theme={theme}>
          <Script
            src="https://kit.fontawesome.com/65590ff3eb.js"
            crossOrigin="anonymous"
          ></Script>
          <Layout>
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <Component {...pageProps} canonical={url} key={url} />
            </AnimatePresence>
          </Layout>
        </ThemeProvider>
      </GlobalProvider>
    </MoralisProvider>
  );
}

export default MyApp;
