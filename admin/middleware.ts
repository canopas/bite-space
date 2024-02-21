"use client";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { verify } from "@/utils/jwt-auth";

const loginPages = ["/signin", "/signup"];
const adminPages = ["/", "/categories", "/restaurants", "/menus", "/dishes"];
const ownerPages = ["/", "/menus", "/dishes"];

const middleware = async (request: NextRequest) => {
  const token = cookies().get("token")?.value;

  if (loginPages.includes(request.nextUrl.pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!request.nextUrl.pathname.startsWith("/_next")) {
    if (token) {
      const user = await verify(token);
      console.log("Verified user : ", user);

      if (
        adminPages.includes(request.nextUrl.pathname) &&
        user.role == "admin"
      ) {
        return;
      }

      if (
        ownerPages.includes(request.nextUrl.pathname) &&
        user.role == "owner"
      ) {
        return;
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.rewrite(new URL("/signin", request.url));
  }
};

export default middleware;
