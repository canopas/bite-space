import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { setSessionForHour, verify } from "@/utils/jwt-auth";

const loginPages = ["/signin", "/signup"];
const adminPages = [
  "/categories",
  "/restaurants",
  "/menus",
  "/dishes",
  "/profile",
  "/settings",
];
const ownerPages = ["/menus", "/dishes", "/profile", "/settings"];

const middleware = async (request: NextRequest) => {
  const userRole = cookies().get("user-role")?.value;
  console.log("user-role : ", userRole);

  if (loginPages.includes(request.nextUrl.pathname)) {
    if (userRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!userRole && !loginPages.includes(request.nextUrl.pathname)) {
    const token = cookies().get("token")?.value;
    const user = await verify(token!);

    console.log("new role : ", request.cookies.get("user-role"));
    console.log("it's user : ", user, token);

    if (
      !token ||
      user.code == "ERR_JWT_EXPIRED" ||
      user.code == "ERR_JWS_INVALID"
    ) {
      console.log("yes i'm in");
      return;
    }

    console.log("no i'm out");
    // await setSessionForHour("user-role", user.role);
    request.cookies.set("user-role", "admin");
    return;
  }

  if (!request.nextUrl.pathname.startsWith("/_next")) {
    if (adminPages.includes(request.nextUrl.pathname) && userRole == "admin") {
      return;
    }

    if (
      ownerPages.some((path) => request.nextUrl.pathname.startsWith(path)) &&
      userRole == "owner"
    ) {
      return;
    }

    if (request.nextUrl.pathname == "/") {
      return;
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return;
};

export default middleware;
