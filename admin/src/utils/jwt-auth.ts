"use client";

import { SignJWT, jwtVerify } from "jose";
import CryptoJS from "crypto-js";
import config from "../../config";

export async function sign(payload: any) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // One week

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(config.JWT_SECRET));

  if (typeof window !== "undefined") {
    window.localStorage.setItem("token", token);
    await setSessionForHour(
      "login-info",
      payload.id + "/" + payload.role + "/" + payload.restaurant,
    );
  }
}

export async function verify(token: string): Promise<any> {
  try {
    if (token) {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(config.JWT_SECRET),
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
    if (typeof window !== "undefined") window.localStorage.removeItem(params);
  } catch (error) {
    console.error("Error in logout: ", error);
  }
}

export async function getCookiesValue(params: string): Promise<any> {
  const value =
    typeof window !== "undefined" ? window.localStorage.getItem(params) : null;
  return value
    ? CryptoJS.AES.decrypt(value, config.CRYPTO_SECRET).toString(
        CryptoJS.enc.Utf8,
      )
    : value;
}

export async function setSessionForHour(name: string, value: string) {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      config.CRYPTO_SECRET,
    ).toString();

    if (typeof window !== "undefined")
      window.localStorage.setItem(name, encrypted);
  } catch (error) {
    console.error("Error while setting cookie : ", error);
  }
}

export async function manageUserCookies(): Promise<any> {
  const userInfo =
    typeof window !== "undefined"
      ? window.localStorage.getItem("login-info")
      : null;
  if (userInfo) return userInfo;

  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  const user = await verify(token!);

  if (
    !token ||
    user.code == "ERR_JWT_EXPIRED" ||
    user.code == "ERR_JWS_INVALID"
  ) {
    console.log("From auth : ", user, token);
    return "LOGIN_NEEDED";
  }

  await setSessionForHour(
    "login-info",
    user.id + "/" + user.role + "/" + user.restaurant,
  );

  return;
}

export async function fetchEmailFromToken(token: string): Promise<string> {
  const user = await verify(token);

  if (user.code == "ERR_JWT_EXPIRED" || user.code == "ERR_JWS_INVALID")
    return user.code;

  return user.email;
}
