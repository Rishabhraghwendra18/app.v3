import "../app/styles/globals.css";
import "../app/styles/quill.bubble.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import GlobalProvider from "app/context/web3Context";
import { createTheme, ThemeProvider } from "@mui/material";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  let theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#0061ff",
      },
      background: {
        default: "#000f29",
      },
      text: {
        primary: "#eaeaea",
        secondary: "#99ccff",
      },
      divider: "#5a6972",
    },
  });
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

          <Component {...pageProps} />
        </ThemeProvider>
      </GlobalProvider>
    </MoralisProvider>
  );
}

export default MyApp;
