"use client";

import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getCookiesValue } from "@/utils/jwt-auth";

const AddMenuPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [restaurantId, setRestaurantId] = useState<number>(0);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
      setIsDataLoading(false);
    };

    setCookiesInfo();
  }, []);

  const handleAddMenu = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (restaurantId == 0) return;

    try {
      const mySchema = z.object({
        name: z.string().min(3),
      });

      const response = mySchema.safeParse({ name: name });

      if (!response.success) {
        const { errors: err } = response.error;
        const errArr = err.map((error) => ({
          for: error.path[0],
          message: error.message,
        }));
        setErrors(errArr);
        throw err;
      }

      setErrors([]);

      const { error } = await supabase
        .from("menus")
        .insert({ name: name, restaurant_id: restaurantId });

      if (error) throw error;

      router.push("/menus");
    } catch (error) {
      console.error("Error while saving menu: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {!isDataLoading && !restaurantId ? (
        <div className="mb-10 flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
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
              You can not add menu.
            </h5>
            <ul>
              <li className="leading-relaxed text-[#CD5D5D]">
                First create space (restaurant / cafe) in your account.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Add Menu
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Menu Details
          </h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleAddMenu}>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "name")?.message}
            </div>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="h-10 w-30 rounded-md bg-primary font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
              disabled={isLoading || !restaurantId}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddMenuPage;
