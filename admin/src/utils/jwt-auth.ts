"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import CryptoJS from "crypto-js";

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

  await setSessionForHour(
    "login-info",
    payload.id + "-" + payload.role + "-" + payload.restaurant,
  );
}

export async function verify(token: string): Promise<any> {
  try {
    if (token) {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!),
      );
      return payload;
    }
    return;
  } catch (error) {
    console.error("JWT error: ", error);
    return error;
  }
}

export async function logout(params: string) {
  try {
    cookies().delete(params);
  } catch (error) {
    console.error("Error in logout: ", error);
  }
}

export async function getCookiesValue(params: string): Promise<any> {
  const value = cookies().get(params)?.value;
  return value
    ? CryptoJS.AES.decrypt(
        value,
        process.env.NEXT_PUBLIC_CRYPTO_SECRET!,
      ).toString(CryptoJS.enc.Utf8)
    : value;
}

export async function setSessionForHour(name: string, value: string) {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      process.env.NEXT_PUBLIC_CRYPTO_SECRET!,
    ).toString();

    cookies().set(name, encrypted, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60, // One hour
      path: "/",
    });
  } catch (error) {
    console.error("Error while setting cookie : ", error);
  }
}

export async function manageUserCookies(): Promise<any> {
  const userInfo = cookies().get("login-info")?.value;
  if (userInfo) return;

  const token = cookies().get("token")?.value;
  const user = await verify(token!);

  if (
    !token ||
    user.code == "ERR_JWT_EXPIRED" ||
    user.code == "ERR_JWS_INVALID"
  ) {
    console.log("i'm in : ", user, token);
    return "LOGIN_NEEDED";
  }

  await setSessionForHour(
    "login-info",
    user.id + "-" + user.role + "-" + user.restaurant,
  );
  return;
}
