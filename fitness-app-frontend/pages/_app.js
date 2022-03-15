import Head from "next/head";
import { useEffect } from "react";
import "./index.css";

const MyApp = ({ Component, pageProps }) => {
  // useEffect(() => {
  //   if (window.location.origin !== 'https://www.fitroyale.fit') window.location = 'https://www.fitroyale.fit'
  // })
  return (
    <>
      <Head>
        <title>FitRewards</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Get fit and get rewards." />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
