"use client";

import Image from "next/image";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/router";
import SingleImgPreview from "@/components/ImagePreview/SingleImage";
import {
  changeFileExtensionToWebpExtension,
  convertToWebP,
  deleteFileFroms3,
  uploadFileTos3,
} from "@/utils/image";

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [imageData, setImageData] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [previewFileData, setPreviewFileData] = useState(
    {} as {
      previewType: string;
      previewUrl: string;
      previewName: string;
      isDragging: boolean;
    }
  );

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, image, description")
        .eq("id", id)
        .single();

      if (error) throw error;

      setPreviewFileData({
        previewType: "image",
        previewUrl: data.image,
        previewName: "",
        isDragging: false,
      });

      setName(data.name);
      setDescription(data.description);
      setImage(data.image);
    };

    fetchCategory();
  }, [id]);

  const handleEditCategory = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
        description: z.string().min(3),
        image: z.string().min(10, { message: "Image is required" }),
      });

      let image_url = image;

      if (imageData) {
        const webpBlob = await convertToWebP(imageData);

        const currentDate = new Date();

        image_url = await uploadFileTos3(
          "categories",
          webpBlob,
          currentDate.getTime() +
            "-" +
            changeFileExtensionToWebpExtension(imageData.name)
        );

        await deleteFileFroms3(image);
      }

      const response = mySchema.safeParse({
        name: name,
        description: description,
        image: image_url,
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

      const { error } = await supabase.from("categories").upsert({
        id: id,
        name: name,
        description: description,
        image: image_url,
      });

      if (error) throw error;

      router.push("/categories");
    } catch (error) {
      console.error("Error while adding category: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploading = (file: any) => {
    setImageData(file);
  };

  return (
    <section>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Edit Category
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Category Details
          </h3>
        </div>
        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={handleEditCategory}
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
          <div className="mb-5.5">
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
                defaultValue={description}
              ></textarea>
            </div>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "description")?.message}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Image <span className="text-meta-1">*</span>
            </label>
            <SingleImgPreview
              uploadedFile={[previewFileData, setPreviewFileData]}
              callback={handleFileUploading}
            >
              {!previewFileData || !previewFileData.previewUrl ? (
                <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-10 dark:bg-meta-4 sm:py-7.5">
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
                      image for category
                    </p>
                    <p className="mt-1.5">PNG, JPG, JPEG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Image
                    className="h-56 w-72 rounded-2xl object-contain"
                    src={previewFileData.previewUrl as string}
                    height={224}
                    width={300}
                    alt="image"
                  />
                </div>
              )}
            </SingleImgPreview>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "image")?.message}
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

export default EditCategoryPage;
