"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";

import supabase from "@/utils/supabase";
import { z } from "zod";
import { fetchEmailFromToken } from "@/utils/jwt-auth";
import CryptoJS from "crypto-js";
import config from "../../../config";

const ResetPassword = ({ paramsData }: { paramsData: { token: string } }) => {
  const router = useRouter();

  const [error, setError] = useState<any>();
  const [errors, setErrors] = useState<any[]>([]);

  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tokenUser, setUser] = useState<any>();
  const [password, setPassword] = useState<string>("");
  const [repeatPwd, setRepeatPassword] = useState<string>("");

  const verifyGivenToken = async () => {
    try {
      const email = await fetchEmailFromToken(paramsData.token);

      if (email == "ERR_JWT_EXPIRED" || email == "ERR_JWS_INVALID") {
        setIsShowError(true);
        setError("This link is expired now, you can try by using new link.");
        return;
      }

      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .eq("reset_password", paramsData.token)
        .single();

      if (error) {
        setIsShowError(true);
        setError(
          "This link is expired or you haven't applied for reset password.",
        );
        return;
      }

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const verifyGivenToken = async () => {
      try {
        const email = await fetchEmailFromToken(paramsData.token);

        if (email == "ERR_JWT_EXPIRED" || email == "ERR_JWS_INVALID") {
          setIsShowError(true);
          setError("This link is expired now, you can try by using new link.");
          return;
        }

        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("email", email)
          .eq("reset_password", paramsData.token)
          .single();

        if (error) {
          setIsShowError(true);
          setError(
            "This link is expired or you haven't applied for reset password.",
          );
          return;
        }

        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    verifyGivenToken();
  }, [paramsData.token]);

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (isShowError) return;
    setIsLoading(true);

    try {
      const mySchema = z.object({
        password: z.string().min(8),
        "repeat-password": z
          .string()
          .min(8, { message: "Re-type password (min 8 characters required)" }),
      });

      const response = mySchema.safeParse({
        password: password,
        "repeat-password": repeatPwd,
      });

      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message });
        }
        setErrors(errArr);
        return;
      }

      if (password !== repeatPwd) {
        setErrors([
          {
            for: "repeat-password",
            message: "Password not matched",
          },
        ]);
        return;
      }

      setErrors([]);
      await verifyGivenToken();

      var encryptedPassword = CryptoJS.AES.encrypt(
        password,
        config.CRYPTO_SECRET,
      ).toString();

      const { error } = await supabase.from("admins").upsert({
        id: tokenUser.id,
        name: tokenUser.name,
        email: tokenUser.email,
        password: encryptedPassword,
        role: tokenUser.role,
        reset_password: null,
      });

      if (error) throw error;

      router.push("/signin");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setIsShowError(true);
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsShowError(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="h-full min-h-screen bg-white shadow-default dark:bg-boxdark">
        <div className="flex h-full flex-col items-center gap-30">
          <div className="flex w-full py-10 shadow-xl">
            <Link
              className="inline-block w-1/2 border-r border-stroke pr-4 text-right text-4xl font-extrabold text-primary"
              href="/"
            >
              <span className="text-black">Bite</span> Space
            </Link>

            <p className="pl-4">
              Elevate your dining experience with every bite. <br /> Where
              passion meets the palate – Welcome to a world of culinary delight!
            </p>
          </div>

          {isShowError ? (
            <div className="fixed mb-10 flex w-full max-w-242.5 border-l-6 border-[#F87171] bg-rose-100 px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
              <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                    fill="#ffffff"
                    stroke="#ffffff"
                  ></path>
                </svg>
              </div>
              <div className="w-full">
                <h5 className="mb-3 font-semibold text-[#B45454]">Error</h5>
                <ul>
                  <li className="leading-relaxed text-[#CD5D5D]">{error}</li>
                </ul>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="text-center">
            <h2 className="mb-1.5 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Reset Password
            </h2>
            <span className="mb-9 block">Enter your new password below</span>

            <form
              onSubmit={handleResetPassword}
              className="flex w-full flex-col items-center"
            >
              <div className="mb-4 w-96">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter 8+ character password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="mt-1 text-xs text-meta-1">
                  {errors.find((error) => error.for === "password")?.message}
                </div>
              </div>

              <div className="mb-6 w-96">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Re-type Password <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={repeatPwd}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="mt-1 text-xs text-meta-1">
                  {
                    errors.find((error) => error.for === "repeat-password")
                      ?.message
                  }
                </div>
              </div>

              <div className="mb-5 w-96">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                  disabled={isLoading}
                >
                  Set Password
                </button>
              </div>

              <div className="mt-6 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
