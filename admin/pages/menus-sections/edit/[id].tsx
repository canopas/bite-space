"use client";

import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/router";
import { getCookiesValue } from "@/utils/jwt-auth";
import MultiSelect from "@/components/FormElements/MultiSelect";

const EditMenusSectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurantId, setRestaurantId] = useState<number>(0);

  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [menus, setMenusData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
    };

    const fetchMenusSections = async () => {
      const { data, error } = await supabase
        .from("menus_sections")
        .select("id, name, menu_ids")
        .eq("id", id)
        .single();

      if (error) throw error;

      setName(data.name);
      setSelectedOptions(data.menu_ids);

      const user = await getCookiesValue("login-info");
      const { data: menus, error: menuError } = await supabase
        .from("menus")
        .select("id, name")
        .eq("restaurant_id", user.split("/")[2]);

      if (menuError) throw menuError;

      setMenusData(menus);
    };

    setCookiesInfo();
    fetchMenusSections();
  }, [id]);

  const handleEditMenusSection = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
        menu_ids: z.array(z.number().gt(0)).min(1),
      });

      const response = mySchema.safeParse({
        name: name,
        menu_ids: selectedOptions,
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

      const { error } = await supabase.from("menus_sections").upsert({
        id: id,
        restaurant_id: restaurantId,
        name: name,
        menu_ids: selectedOptions,
      });

      if (error) throw error;

      router.push("/menus-sections");
    } catch (error) {
      console.error("Error while adding menus section: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Edit Menus Section
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Menus Section Details
          </h3>
        </div>
        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={handleEditMenusSection}
        >
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              value={name}
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "name")?.message}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Menus <span className="text-meta-1">*</span>
            </label>
            <MultiSelect
              id="addMenusSection"
              optionsList={menus}
              selectedOptionsState={[selectedOptions, setSelectedOptions]}
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "menu_ids")?.message}
            </div>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="h-10 w-30 rounded-md bg-primary font-medium text-white disabled:cursor-wait disabled:opacity-30"
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

export default EditMenusSectionPage;
