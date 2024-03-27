import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/common/Loader";
import "@/styles/globals.css";
import "@/styles/input-tags.css";
import "@/styles/input-time.css";
import "@/styles/satoshi.css";
import "@/styles/style.css";
import { manageUserCookies } from "@/utils/jwt-auth";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const loginPages = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router; 
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const manageCookies = async () => { 
      const code = await manageUserCookies();
      if (
        code == "LOGIN_NEEDED" &&
        !loginPages.some((path) => pathname.startsWith(path))
      ) {
        router.push("/signin");
      }
      if (
        loginPages.some((path) => pathname.startsWith(path)) &&
        code != "" &&
        code != "LOGIN_NEEDED"
      ) {
        router.push("/");
      }
    };

    manageCookies();
    setTimeout(() => setLoading(false), 500);
  }, [pathname, router]);

  return (
    <>
      {loginPages.some((path) => pathname?.startsWith(path)) ? (
        <Component {...pageProps} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {loading ? (
                  <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    <Loader />
                  </div>
                ) : (
                  <Component {...pageProps} />
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
