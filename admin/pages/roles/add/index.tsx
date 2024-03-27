"use client";

import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getCookiesValue } from "@/utils/jwt-auth";

const AddRolePage = () => {
  const router = useRouter();

  const [restaurantId, setRestaurantId] = useState<number>(0);

  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
    };

    setCookiesInfo();
  }, []);

  const handleAddRoles = async (e: any) => {
    e.preventDefault();
    if (restaurantId == 0) return;
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
      });

      const response = mySchema.safeParse({ name: name });

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

      const { error } = await supabase
        .from("roles")
        .insert({ restaurant_id: restaurantId, name: name });

      if (error) throw error;

      router.push("/roles");
    } catch (error) {
      console.error("Error while adding role: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Add Role
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Role Details
          </h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleAddRoles}>
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
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "name")?.message}
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

export default AddRolePage;
