import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function withScrollRestoration(WrappedComponent: any) {
  return function WithScrollRestoration(props: any) {
    const router = useRouter();
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

    useEffect(() => {
      const handleRouteChange = (url: any) => {
        if (router.asPath !== url) {
          // Store the previous page URL when navigating away
          setPrevPageUrl(router.asPath);
          window.sessionStorage.setItem(
            `scrollY:${router.asPath}`,
            window.scrollY.toString()
          );
        }
      };

      const handleRouteComplete = (url: any) => {
        const scrollY = window.sessionStorage.getItem(`scrollY:${url}`);
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
        }
      };

      const handlePopState = () => {
        // Retrieve the scroll position for the previous page
        const scrollY = window.sessionStorage.getItem(`scrollY:${prevPageUrl}`);
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
        }
      };

      router.events.on("routeChangeStart", handleRouteChange);
      router.events.on("routeChangeComplete", handleRouteComplete);
      window.addEventListener("popstate", handlePopState);

      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.off("routeChangeComplete", handleRouteComplete);
        window.removeEventListener("popstate", handlePopState);
      };
    }, [prevPageUrl, router.asPath, router.events]);

    return <WrappedComponent {...props} />;
  };
}

export default withScrollRestoration;
