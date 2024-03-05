import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCookiesValue } from "@/utils/jwt-auth";

const loginPages = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const superAdminPages = ["/categories", "/profile"];

const adminPages = [
  "/categories",
  "/restaurants",
  "/menus",
  "/dishes",
  "/profile",
  "/settings",
];

const generalPages = ["/menus", "/dishes", "/profile", "/settings"];

const middleware = async (request: NextRequest) => {
  const user = await getCookiesValue("login-info");
  console.log(user);
  const userRole = user ? user.split("/")[1] : null;

  if (loginPages.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (userRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!request.nextUrl.pathname.startsWith("/_next")) {
    if (!user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (
      superAdminPages.some((path) =>
        request.nextUrl.pathname.startsWith(path),
      ) &&
      userRole == "super-admin"
    ) {
      return;
    }

    if (
      adminPages.some((path) => request.nextUrl.pathname.startsWith(path)) &&
      userRole == "admin"
    ) {
      return;
    }

    if (
      generalPages.some((path) => request.nextUrl.pathname.startsWith(path)) &&
      userRole == "staff"
    ) {
      return;
    }

    return;
  }

  return;
};

export default middleware;
