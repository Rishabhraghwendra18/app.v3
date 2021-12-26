import "../app/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import UserProvider from "app/context/web3Context";
import { createTheme, ThemeProvider } from "@mui/material";

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
      <UserProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </UserProvider>
    </MoralisProvider>
  );
}

export default MyApp;
