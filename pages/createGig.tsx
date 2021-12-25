import { Layout } from "app/components/layouts";
import { GigForm } from "app/components/modules/gigForm/gigForm";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

interface Props {}

const CreateGig: NextPage<Props> = (props: Props) => {
  let theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#99ccff",
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
    <div>
      <Head>
        <title>Create gig</title>
        <meta name="description" content="Create Gig" />
      </Head>
      <ThemeProvider theme={theme}>
        <Layout>
          <div className="px-12">
            <div className="grid gap-1 grid-cols-6 mt-8">
              <div></div>
              <div className="flex flex-row col-span-5">
                <div className="flex flex-row w-5/6 items-center">
                  <span className="text-base text-3xl text-blue-bright">
                    Create Gig
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-1 grid-cols-6 mt-8">
              <div className=""></div>
              <GigForm />
            </div>
          </div>
        </Layout>
      </ThemeProvider>
    </div>
  );
};

export default CreateGig;
