"use client";

import supabase from "@/utils/supabase";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const EditMenuPage = ({ params }: { params: { id: number } }) => {
  const [error, setErrorMessage] = useState({});
  const router = useRouter();
  const [menusData, setMenusData] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("id, name")
        .eq("id", params.id)
        .single();

      if (error) {
        throw error;
      }

      setMenusData(data);
    };

    fetchMenus();
  }, []);

  async function onSubmit() {
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
      });

      mySchema.parse({ name: name });

      let { error } = await supabase.from("menus").upsert({
        id: params.id,
        name: name,
      });

      if (error) throw error;

      router.push("/menus");
    } catch (error) {
      setErrorMessage(error as {});
      console.error("error from catch", error);
    } finally {
      setIsLoading(false);
    }
  }

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
        <div>{error.message}</div>
        <form className="flex flex-col gap-5.5 p-6.5" method="post">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              value={name ? name : menusData.name}
              name="name"
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="text-end">
            <button
              type="button"
              onClick={onSubmit}
              className="h-10 w-30 rounded-md bg-blue-600  font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
              disabled={isLoading || !name}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditMenuPage;