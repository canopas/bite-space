import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { verify } from "@/utils/jwt-auth";

const useLoginInfo = () => {
  const [loginInfo, setLoginInfo] = useLocalStorage("login-info", "");

  useEffect(() => {
    const manageCookies = async () => {
      const userInfo = window.localStorage.getItem("login-info");

      if (userInfo == "" || !userInfo) {
        const token = window.localStorage.getItem("token");
        const user = await verify(token!);

        if (
          !token ||
          user.code == "ERR_JWT_EXPIRED" ||
          user.code == "ERR_JWS_INVALID"
        ) {
          console.log("From login hook : ", user, token);
          setLoginInfo("LOGIN_NEEDED");
          return;
        }

        setLoginInfo(user.id + "/" + user.role + "/" + user.restaurant);
        return;
      }

      setLoginInfo(userInfo);
      return;
    };

    manageCookies();
  }, [setLoginInfo]);

  return [loginInfo, setLoginInfo];
};

export default useLoginInfo;
