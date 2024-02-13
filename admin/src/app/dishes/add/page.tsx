"use client";

import "../../../css/input-tags.css";
import supabase from "@/utils/supabase";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TagsInput } from "react-tag-input-component";

const AddMenuPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenuOption] = useState<string>("");
  const [selectedCategory, setSelectedCategoryOption] = useState<string>("");
  const [selected, setSelected] = useState([]);
  const [menus, setMenusData] = useState([]);
  const [categories, setCategories] = useState([]);

  async function onSubmit() {
    setIsLoading(true);

    try {
      router.push("/dishes");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchOptionsData = async () => {
      const { data: menus, error: menuError } = await supabase
        .from("menus")
        .select("id, name");
      if (menuError) {
        throw menuError;
      }

      setMenusData(menus);

      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select();
      if (categoryError) {
        throw categoryError;
      }

      setCategories(categories);
    };

    fetchOptionsData();
  }, []);

  return (
    <DefaultLayout>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Add Dish
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Dish Details
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
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Menu <span className="text-meta-1">*</span>
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={selectedMenu}
                  onChange={(e) => {
                    setSelectedMenuOption(e.target.value);
                  }}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    selectedMenu ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value=""
                    disabled
                    className="hidden text-body dark:text-bodydark"
                  >
                    Select Menu
                  </option>

                  {menus.map((menu, key) => (
                    <option
                      key={key}
                      value={menu.id}
                      className="text-body dark:text-bodydark"
                    >
                      {menu.name}
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
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategoryOption(e.target.value);
                  }}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    selectedCategory ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value=""
                    disabled
                    className="hidden text-body dark:text-bodydark"
                  >
                    Select Category
                  </option>

                  {categories.map((category, key) => (
                    <option
                      key={key}
                      value={category.id}
                      className="text-body dark:text-bodydark"
                    >
                      {category.name}
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
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Tags <span className="text-meta-1">*</span>
            </label>
            <TagsInput
              value={selected}
              onChange={setSelected}
              name="tags"
              placeHolder="Write Your Tags Here"
            />
          </div>
          <div className="text-end">
            <button
              onClick={onSubmit}
              type="button"
              className="h-10 w-30 rounded-md bg-blue-600 font-medium text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddMenuPage;
