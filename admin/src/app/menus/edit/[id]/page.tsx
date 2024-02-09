"use client";

import supabase from "@/utils/supabase";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "@/types/menu";

const EditMenuPage = ({ params }: { params: { id: number } }) => {
  const [menusData, setMenusData] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("id, name")
        .eq("id", params.id);

      if (error) {
        throw error;
      }

      setMenusData(data);
    };

    fetchCategories();
  }, []);

  return (
    <DefaultLayout>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Edit Menu
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Menu Details
          </h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="h-10 w-30 rounded-md bg-blue-600 font-medium text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditMenuPage;
