"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export async function sign(payload: any) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // One week

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

  await setSessionForHour("user-role", payload.role);
}

export async function verify(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!),
    );
    return payload;
  } catch (error) {
    console.error("JWT error: ", error);
    return error;
  }
}

export async function logout(params: string) {
  cookies().delete(params);
}

export async function getUser(params: string): Promise<any> {
  return cookies().get(params)?.value;
}

export async function setSessionForHour(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: true,
    maxAge: 60, // One hour
    path: "/",
  });
}
