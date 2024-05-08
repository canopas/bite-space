import "@/styles/globals.css";
import "@/styles/index.css";
import "@/styles/reels.css";
import "@/styles/swiper.css";
import "@/styles/inter.css";

import type { AppProps } from "next/app";
import ReduxProvider from "./redux-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}
