"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-black">
      <Head>
        <title>Bite Space</title>
      </Head>
      <Providers>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </Providers>
    </div>
  );
}
