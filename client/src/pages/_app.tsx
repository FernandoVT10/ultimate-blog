import type { AppProps } from "next/app";

import { ToastContainer } from "react-toastify";

import AuthProvider from "@providers/AuthProvider";
import Head from "next/head";

import "react-toastify/dist/ReactToastify.min.css";
import "highlight.js/styles/base16/circus.css";
import "../styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>

      <ToastContainer
        position="bottom-left"
        theme="dark"
      />
    </>
  );
}
