import "@/styles/globals.css";
import "@/styles/index.css";
import "@/styles/reels.css";
import "@/styles/swiper.css";
import "@/styles/inter.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
