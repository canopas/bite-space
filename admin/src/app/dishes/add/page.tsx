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

const AddMenuPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [menus, setMenusData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isImagesChecked, setIsImagesChecked] = useState<boolean>(true);
  const [isVideoChecked, setIsVideoChecked] = useState<boolean>(false);

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [menuId, setMenuOption] = useState<number | null>(0);
  const [categoryId, setCategoryOption] = useState<number | null>(0);
  const [tags, setTags] = useState([]);
  const [price, setPrice] = useState<number | null>(null);

  const [imagesData, setImagesData] = useState([]);
  const images: string[] = [];
  const uploadedFiles = [] as Array<{
    fileType: string;
    fileUrl: string;
    fileName: string;
  }>;

  const [videoData, setVideo] = useState({} as any);
  let video: string | null = null;
  const [previewFileData, setPreviewFileData] = useState(
    {} as {
      previewType: string;
      previewUrl: string;
      previewName: string;
      isDragging: boolean;
    },
  );

  async function onSubmit() {
    setIsLoading(true);
    try {
      const mySchema = z.object({
        name: z.string().min(3),
        description: z.string().min(3),
        menu_id: z.number().positive(),
        category_id: z.number().positive(),
        tags: z.array(z.string().min(2)).min(1),
        price: z.number().positive(),
      });

      mySchema.parse({
        name: name,
        description: description,
        menu_id: menuId,
        category_id: categoryId,
        tags: tags,
        price: price,
      });

      if (isImagesChecked) {
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
      } else {
        const currentDate = new Date();
        const { data: videoStore, error: videoErr } = await supabase.storage
          .from("test")
          .upload(currentDate.getTime() + "-" + videoData.name, videoData);

        if (videoErr) throw videoErr;

        video =
          "https://mbbmnygwewvjsxsjtzbo.supabase.co/storage/v1/object/public/test/" +
          videoStore.path;
      }

      const { error } = await supabase.from("dishes").insert({
        category_id: categoryId,
        menu_id: menuId,
        name: name,
        price: price,
        description: description,
        images: isVideoChecked ? null : images,
        video: video,
        tags: tags,
      });

      if (error) throw error;

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

  const handleFilesUploading = async (files: any) => {
    setImagesData(files);
  };

  const handleFileUploading = (file: any) => {
    setVideo(file);
  };

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
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
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
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
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
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryOption(parseInt(e.target.value));
                  }}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
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
                uploadedFile={[previewFileData, setPreviewFileData]}
                callback={handleFileUploading}
              >
                {!previewFileData || !previewFileData.previewUrl ? (
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
                    >
                      <source
                        src={previewFileData.previewUrl}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                )}
              </SingleImgPreview>
            </div>
          )}
          <div className="text-end">
            <button
              onClick={onSubmit}
              type="button"
              className="h-10 w-30 rounded-md bg-blue-600 font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
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
