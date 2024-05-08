import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { setIsPageResetState } from "@/store/slice";

function withScrollRestoration(WrappedComponent: any) {
  return function WithScrollRestoration(props: any) {
    const router = useRouter();
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
      const handleRouteChange = (url: any) => {
        if (router.asPath !== url) {
          // Store the previous page URL when navigating away
          setPrevPageUrl(router.asPath);
          sessionStorage.setItem(
            `scrollY:${router.asPath}`,
            window.scrollY.toString()
          );
        }
      };

      const handleRouteComplete = (url: any) => {
        const scrollY = sessionStorage.getItem(`scrollY:${url}`);
        if (window.history.state.options._h == 0 && scrollY) {
          dispatch(setIsPageResetState(true));
          setTimeout(function () {
            window.scroll(0, parseInt(scrollY));
          }, 10);
        } else {
          dispatch(setIsPageResetState(false));
        }
      };

      const handlePopState = () => {
        // Retrieve the scroll position for the previous page
        const scrollY = sessionStorage.getItem(`scrollY:${prevPageUrl}`);
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
    }, [dispatch, prevPageUrl, router.asPath, router.events]);

    return <WrappedComponent {...props} />;
  };
}

export default withScrollRestoration;
