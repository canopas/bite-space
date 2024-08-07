"use client";

import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getCookiesValue } from "@/utils/jwt-auth";
import { render } from "@react-email/render";
import InviteMemberEmail from "../../../emails/invitationMail";
import { sendEmail } from "@/service/mailService";

const InvitedMemberPage = () => {
  const router = useRouter();

  const [error, setError] = useState<any>();
  const [errors, setErrors] = useState<any[]>([]);

  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [restaurantId, setRestaurantId] = useState<number>(0);
  const [roles, setRolesData] = useState<any[]>([]);
  const [roleId, setRoleOption] = useState<number>(0);

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
      setIsDataLoading(false);
    };

    const fetchOptionsData = async () => {
      try {
        const user = await getCookiesValue("login-info");
        const { data: role, error: rolesError } = await supabase
          .from("roles")
          .select("id, name")
          .in("restaurant_id", [user.split("/")[2], 0]);

        if (rolesError) throw rolesError;

        setRolesData(role);
      } catch (error) {
        console.error("Error while fetching options: ", error);
      }
    };

    setCookiesInfo();
    fetchOptionsData();
  }, []);

  const handleInviteMember = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!restaurantId) return;

    try {
      const user = await getCookiesValue("login-info");
      const mySchema = z.object({
        email: z.coerce.string().email().min(5),
        role_id: z.number().positive({ message: "Select role from list" }),
      });

      const response = mySchema.safeParse({
        email: email,
        role_id: roleId,
      });

      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message });
        }
        setErrors(errArr);
        throw err;
      }

      setErrors([]);

      const { data, error } = await supabase
        .from("pending_invitations")
        .insert({
          email: email,
          invited_by: user.split("/")[0],
          invited_for: user.split("/")[2],
          role_id: roleId,
        })
        .select("*, admins(name), restaurants(name), roles(name)")
        .single();

      if (error) throw error;

      await sendEmail({
        to: email,
        subject: "Invitation To Join Space",
        message: render(
          InviteMemberEmail({
            invited_by: data.admins.name,
            invited_for: data.restaurants.name,
            role: data.roles.name,
          })
        ),
      });

      router.push("/invited-members");
    } catch (error) {
      setError(error);
      console.error("Error while invite member: ", error);
      setIsShowError(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsShowError(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {(isShowError || (!isDataLoading && !restaurantId)) ?? (
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
            <h5 className="mb-3 font-semibold text-[#B45454]">
              You can not invite member.
            </h5>
            <ul>
              <li className="leading-relaxed text-[#CD5D5D]">
                {error
                  ? error.message
                  : "First create space (restaurant / cafe) in your account."}
              </li>
            </ul>
          </div>
        </div>
      )}
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Invite Member
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Member Details
          </h3>
        </div>
        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={handleInviteMember}
        >
          <div className="flex gap-5">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "email")?.message}
              </div>
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Role <span className="text-meta-1">*</span>
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={roleId}
                  onChange={(e) => {
                    setRoleOption(parseInt(e.target.value));
                  }}
                  className={`relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    roleId ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option value="" className="hidden">
                    Select Role
                  </option>

                  {roles.map((role, key) => (
                    <option
                      key={key}
                      value={role.id}
                      className="text-body dark:text-bodydark"
                    >
                      {role.name}
                    </option>
                  ))}
                </select>

                <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill="#637381"
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "menu_id")?.message}
              </div>
            </div>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="h-10 w-30 rounded-md bg-primary font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InvitedMemberPage;
