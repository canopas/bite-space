"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "../../pages/providers";
import Head from "next/head";

interface RootLayoutProps {
  children: React.ReactNode;
  manageHeaderColor?: boolean;
}

export default function RootLayout({
  children,
  manageHeaderColor = false,
}: RootLayoutProps) {
  return (
    <div className="dark:bg-black">
      <Head>
        <title>Bite Space</title>
      </Head>
      <Providers>
        <Header manageColor={manageHeaderColor} />
        {children}
        <Footer />
        <ScrollToTop />
      </Providers>
    </div>
  );
}
