"use client";

import "@/css/input-tags.css";
import Image from "next/image";
import supabase from "@/utils/supabase";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TagsInput } from "react-tag-input-component";
import MultipleFileUpload from "@/components/ImagePreview/MultipleImage";
import SingleImgPreview from "@/components/ImagePreview/SingleImage";
import { getCookiesValue } from "@/utils/jwt-auth";

const AddDishPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  const [menus, setMenusData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isImagesChecked, setIsImagesChecked] = useState<boolean>(true);
  const [isVideoChecked, setIsVideoChecked] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [menuId, setMenuOption] = useState<number>(0);
  const [categoryId, setCategoryOption] = useState<number | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [price, setPrice] = useState<number>(0);

  const [imagesData, setImagesData] = useState<any[]>([]);
  const images: string[] = [];
  const uploadedFiles = [] as Array<{
    previewType: string;
    previewUrl: string;
    previewName: string;
  }>;

  const [videoData, setVideo] = useState<any | null>(null);
  let video: string | null = null;
  const [previewVideoData, setPreviewVideoData] = useState(
    {} as {
      previewType: string;
      previewUrl: string;
      previewName: string;
      isDragging: boolean;
    },
  );

  const handleAddDish = async (e: any) => {
    e.preventDefault();
    if (!restaurantId) return;
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
        description: z.string().min(3),
        menu_id: z.number().positive({ message: "Select menu from list" }),
        tags: z.array(z.string().min(2)).min(1),
        price: z.number().positive(),
        images: isImagesChecked
          ? z.array(z.string().min(10)).min(1, { message: "Image is required" })
          : z.null(),
        video: isVideoChecked
          ? z
              .string({
                required_error: "Video is required",
                invalid_type_error: "Video is required",
              })
              .min(10, { message: "Video is required" })
          : z.null(),
      });

      if (isImagesChecked && imagesData) {
        for (var i = 0; i < imagesData.length; i++) {
          const currentDate = new Date();
          const { data: imgData, error: imgErr } = await supabase.storage
            .from("test")
            .upload(
              currentDate.getTime() + "-" + imagesData[i].name,
              imagesData[i],
            );

          if (imgErr) throw imgErr;

          const image_url =
            "https://mbbmnygwewvjsxsjtzbo.supabase.co/storage/v1/object/public/test/" +
            imgData.path;

          images.push(image_url);
        }
      } else if (videoData) {
        const currentDate = new Date();
        const { data: videoStore, error: videoErr } = await supabase.storage
          .from("test")
          .upload(currentDate.getTime() + "-" + videoData.name, videoData);

        if (videoErr) throw videoErr;

        video =
          "https://mbbmnygwewvjsxsjtzbo.supabase.co/storage/v1/object/public/test/" +
          videoStore.path;
      }

      const response = mySchema.safeParse({
        name: name,
        description: description,
        menu_id: menuId,
        tags: tags,
        price: price,
        images: isVideoChecked ? null : images,
        video: video,
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

      const { error } = await supabase.from("dishes").insert({
        category_id: categoryId == 0 ? null : categoryId,
        menu_id: menuId,
        name: name,
        price: price,
        description: description,
        images: isVideoChecked ? null : images,
        video: video,
        tags: tags.map((tag) => tag.toLowerCase()),
      });

      if (error) throw error;

      router.push("/dishes");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
      setIsDataLoading(false);
    };

    const fetchOptionsData = async () => {
      const { data: menus, error: menuError } = await supabase
        .from("menus")
        .select("id, name");

      if (menuError) throw menuError;

      setMenusData(menus);

      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select();

      if (categoryError) throw categoryError;

      setCategories(categories);
    };

    setCookiesInfo();
    fetchOptionsData();
  }, []);

  const handleFilesUploading = async (files: any) => {
    setImagesData(files);
  };

  const handleFileUploading = (file: any) => {
    setVideo(file);
  };

  return (
    <DefaultLayout>
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
              You can not add dish.
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
          Add Dish
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Dish Details
          </h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleAddDish}>
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
          <div>
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="Username"
            >
              Description <span className="text-meta-1">*</span>
            </label>
            <div className="relative">
              <textarea
                className="w-full rounded border border-stroke  px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                rows={5}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "description")?.message}
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Menu <span className="text-meta-1">*</span>
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={menuId}
                  onChange={(e) => {
                    setMenuOption(parseInt(e.target.value));
                  }}
                  className={`relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    menuId ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option value="" className="hidden">
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
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "menu_id")?.message}
              </div>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={categoryId ?? 0}
                  onChange={(e) => {
                    setCategoryOption(parseInt(e.target.value));
                  }}
                  className={`relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    categoryId ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option value="" className="hidden">
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
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="Write Your Tags Here"
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "tags")?.message}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <input
              min={0}
              type="number"
              placeholder="Price"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "price")?.message}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Media Type <span className="text-meta-1">*</span>
            </label>
            <div className="flex gap-5">
              <label
                htmlFor="imagesMedia"
                className="flex cursor-pointer select-none items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="imagesMedia"
                    className="sr-only"
                    onChange={() => {
                      setIsImagesChecked(!isImagesChecked);
                      setIsVideoChecked(!isVideoChecked);
                    }}
                  />
                  <div
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                      isImagesChecked && "border-primary"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                        isImagesChecked && "!bg-primary"
                      }`}
                    >
                      {" "}
                    </span>
                  </div>
                </div>
                Images
              </label>
              <label
                htmlFor="videoMedia"
                className="flex cursor-pointer select-none items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="videoMedia"
                    className="sr-only"
                    onChange={() => {
                      setIsVideoChecked(!isVideoChecked);
                      setIsImagesChecked(!isImagesChecked);
                    }}
                  />
                  <div
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                      isVideoChecked && "border-primary"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                        isVideoChecked && "!bg-primary"
                      }`}
                    >
                      {" "}
                    </span>
                  </div>
                </div>
                Video
              </label>
            </div>
          </div>
          {isImagesChecked ? (
            <div>
              <MultipleFileUpload
                uploadedFiles={uploadedFiles}
                callback={handleFilesUploading}
              >
                {(file: any) => (
                  <div className="flex items-center justify-center">
                    {!file.previewUrl ? (
                      <div className="relative block h-55 w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-5 dark:bg-meta-4 sm:py-7.5">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>
                          </p>
                          <p>images for dish</p>
                          <p className="mt-1.5 text-xs">
                            PNG, JPG, JPEG or GIF
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Image
                          className="h-55 w-40 object-cover"
                          src={file.previewUrl as string}
                          height={250}
                          width={200}
                          alt="image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </MultipleFileUpload>
            </div>
          ) : (
            <div>
              <SingleImgPreview
                accept="video/*"
                uploadedFile={[previewVideoData, setPreviewVideoData]}
                callback={handleFileUploading}
              >
                {!previewVideoData || !previewVideoData.previewUrl ? (
                  <div className="relative block h-55 w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-5 dark:bg-meta-4 sm:py-7.5">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span>
                      </p>
                      <p>video for dish</p>
                      <p className="mt-1.5 text-xs">Video MP4</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <video
                      autoPlay
                      loop
                      muted
                      className="h-55 w-40 object-cover"
                      key={previewVideoData.previewUrl}
                    >
                      <source
                        src={previewVideoData.previewUrl}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                )}
              </SingleImgPreview>
            </div>
          )}
          <div className="mt-1 text-xs text-meta-1">
            {errors.find((error) => error.for === "images")?.message ||
              errors.find((error) => error.for === "video")?.message}
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
    </DefaultLayout>
  );
};

export default AddDishPage;
