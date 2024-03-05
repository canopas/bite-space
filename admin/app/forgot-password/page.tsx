"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";

import supabase from "@/utils/supabase";
import { z } from "zod";
import { SignJWT } from "jose";
import { sendMail } from "../../service/mailService";
import { render } from "@react-email/render";
import ForgotPasswordEmail from "../../emails/forgotPassword";

const ForgotPasswordPage = () => {
  const [error, setError] = useState<any>();
  const [errors, setErrors] = useState<any[]>([]);

  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mySchema = z.object({
        email: z.coerce.string().email().min(5),
      });

      const response = mySchema.safeParse({
        email: email,
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

      setErrors([]);

      const { data: user, error: userError } = await supabase
        .from("admins")
        .select("id, email, role")
        .eq("email", email)
        .single();

      if (userError) throw userError;

      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 60 * 30; // Half hour

      const token = await new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!));

      const { error } = await supabase.from("admins").upsert({
        id: user.id,
        email: user.email,
        role: user.role,
        reset_password: token,
      });

      if (error) throw error;

      await sendMail(
        "Bite Space - Reset Password Link",
        email,
        render(
          ForgotPasswordEmail("http://localhost:3000/reset-password/" + token),
        ),
      );

      setIsShowSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError(error);
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
        <div className="flex h-full flex-col items-center gap-40">
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
                  <li className="leading-relaxed text-[#CD5D5D]">
                    {error.message}
                  </li>
                </ul>
              </div>
            </div>
          ) : isShowSuccess ? (
            <div className="fixed z-[1] flex w-full max-w-242.5 gap-5 border-l-6 border-[#34D399] bg-green-100 px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
              <div className="flex h-full w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
                <svg
                  className="h-9"
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                    fill="white"
                    stroke="white"
                  ></path>
                </svg>
              </div>
              <div className="h-full w-full">
                <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399]">
                  Sent Email Successfully
                </h5>
                <p className="text-sm leading-relaxed text-body">
                  Checkout your email inbox and follow the given instruction for
                  reset password.
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="text-center">
            <h2 className="mb-1.5 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Forgot Password
            </h2>
            <span className="mb-9 block">
              Type in your email and we will send you a link to reset your
              password
            </span>

            <form
              onSubmit={handleForgotPassword}
              className="flex w-full flex-col items-center"
            >
              <div className="mb-4 w-96">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="mt-1 text-xs text-meta-1">
                  {errors.find((error) => error.for === "email")?.message}
                </div>
              </div>

              <div className="mb-5 w-96">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                  disabled={isLoading}
                >
                  Send
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

export default ForgotPasswordPage;
