import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCookiesValue } from "@/utils/jwt-auth";

const loginPages = ["/signin", "/signup", "/forgot-password"];
const adminPages = [
  "/categories",
  "/restaurants",
  "/menus",
  "/dishes",
  "/profile",
  "/settings",
];
const ownerPages = [
  "/restaurants",
  "/menus",
  "/dishes",
  "/profile",
  "/settings",
];

const middleware = async (request: NextRequest) => {
  const user = await getCookiesValue("login-info");
  console.log(user);
  const userRole = user ? user.split("-")[1] : null;

  if (loginPages.includes(request.nextUrl.pathname)) {
    if (userRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!request.nextUrl.pathname.startsWith("/_next")) {
    if (
      adminPages.some((path) => request.nextUrl.pathname.startsWith(path)) &&
      userRole == "admin"
    ) {
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
