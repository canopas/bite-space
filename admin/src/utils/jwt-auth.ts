"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export async function sign(payload: any) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!));

  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

export async function verify(token: string): Promise<any> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!),
  );
  return payload;
}

export async function logout(params: string) {
  cookies().delete(params);
}
