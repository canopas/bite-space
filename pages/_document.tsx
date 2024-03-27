import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
       <Head>
        <title>Bite Space</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="A food web app to show food details of the restaurants" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
