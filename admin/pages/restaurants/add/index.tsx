"use client";

import Image from "next/image";
import supabase from "@/utils/supabase";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TagsInput } from "react-tag-input-component";
import MultipleFileUpload from "@/components/ImagePreview/MultipleImage";
import { getCookiesValue, setSessionForUser } from "@/utils/jwt-auth";
import {
  changeFileExtensionToWebpExtension,
  convertToWebP,
  uploadFileTos3,
} from "@/utils/image";

const AddRestaurantPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [localArea, setLocalArea] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [postalCode, setPostalCode] = useState<number>(0);
  const [country, setCountry] = useState<string>("India");
  const [phone, setPhone] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [imagesData, setImagesData] = useState<any[]>([]);
  const images: string[] = [];
  const uploadedFiles = [] as Array<{
    previewType: string;
    previewUrl: string;
    previewName: string;
  }>;

  const handleAddRestaurant = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const user = await getCookiesValue("login-info");

    try {
      const mySchema = z.object({
        name: z.string().min(3),
        description: z.string().min(5),
        address: z.string().min(10),
        local_area: z.string().min(3),
        city: z.string().min(3),
        state: z.string().min(3),
        postal_code: z.number().positive().min(5),
        country: z.string().min(3),
        images: z
          .array(z.string().min(10))
          .min(1, { message: "Images is required" }),
        phone: z.number().positive().min(10),
        tags: z
          .array(z.string().min(3))
          .min(1, { message: "Tags is required" }),
      });

      if (imagesData) {
        for (var i = 0; i < imagesData.length; i++) {
          const currentDate = new Date();

          const webpBlob = await convertToWebP(imagesData[i]);

          const image_url = await uploadFileTos3(
            "restaurants",
            webpBlob,
            currentDate.getTime() +
              "-" +
              changeFileExtensionToWebpExtension(imagesData[i].name)
          );

          images.push(image_url);
        }
      }

      const response = mySchema.safeParse({
        name: name,
        description: description,
        address: address,
        local_area: localArea,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        images: images,
        phone: parseInt(phone),
        tags: tags,
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

      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .insert({
          name: name,
          description: description,
          address: address,
          local_area: localArea,
          city: city,
          state: state,
          postal_code: postalCode,
          country: country,
          images: images,
          phone: parseInt(phone),
          tags: tags.map((tag) => tag.toLowerCase()),
          week_days: [],
          is_public: isPublic,
        })
        .select()
        .single();

      if (restaurantError) throw restaurantError;

      const { data: role, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "admin")
        .single();

      if (roleError) throw roleError;

      const { error } = await supabase.from("admins_roles_restaurants").insert({
        admin_id: user.split("/")[0],
        role_id: role.id,
        restaurant_id: restaurant.id,
      });

      if (error) throw error;

      await setSessionForUser(
        "login-info",
        user.split("/")[0] + "/" + user.split("/")[1] + "/" + restaurant.id
      );

      window.location.replace(process.env.NEXT_PUBLIC_ADMIN_BASE_URL!);
    } catch (error) {
      console.error("Error while saving restaurant data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesUploading = async (files: any) => {
    setImagesData(files);
  };

  return (
    <section>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Add Restaurant
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Restaurant Details
          </h3>
        </div>
        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={handleAddRestaurant}
        >
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
          <div>
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="Username"
            >
              Address <span className="text-meta-1">*</span>
            </label>
            <div className="relative">
              <textarea
                className="w-full rounded border border-stroke  px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                rows={5}
                placeholder="address"
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "address")?.message}
            </div>
          </div>
          <div className="flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Local Area <span className="text-meta-1">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  placeholder="Katargam"
                  required
                  autoComplete="off"
                  onChange={(e) => setLocalArea(e.target.value)}
                />
              </div>
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "localArea")?.message}
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                City <span className="text-meta-1">*</span>
              </label>
              <input
                className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                placeholder="Surat"
                required
                autoComplete="off"
                onChange={(e) => setCity(e.target.value as any)}
              />
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "city")?.message}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                State <span className="text-meta-1">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  placeholder="Gujarat"
                  required
                  autoComplete="off"
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "state")?.message}
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Postal Code <span className="text-meta-1">*</span>
              </label>
              <input
                className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="number"
                placeholder="395004"
                required
                autoComplete="off"
                onChange={(e) => setPostalCode(parseInt(e.target.value))}
              />
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "postalCode")?.message}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Country <span className="text-meta-1">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                placeholder="India"
                defaultValue="India"
                required
                autoComplete="off"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "country")?.message}
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
              Phone <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="9632587410"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "phone")?.message}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Visibility Type <span className="text-meta-1">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="public"
                name="is_public"
                value="true"
                checked={isPublic}
                aria-checked={isPublic}
                onChange={(e) => setIsPublic(e.target.value === "true")}
                className="h-5 w-5 accent-orange-600 cursor-pointer"
              />
              <label htmlFor="public" className="cursor-pointer">
                Public
              </label>
              <input
                type="radio"
                id="private"
                name="is_public"
                value="false"
                checked={!isPublic}
                aria-checked={!isPublic}
                onChange={(e) => setIsPublic(e.target.value === "true")}
                className="h-5 w-5 accent-orange-600 cursor-pointer"
              />
              <label htmlFor="private" className="cursor-pointer">
                Private
              </label>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Images <span className="text-meta-1">*</span>
            </label>
            <MultipleFileUpload
              uploadedFiles={uploadedFiles}
              callback={handleFilesUploading}
            >
              {(file: any) => (
                <div className="flex items-center justify-center">
                  {!file.previewUrl ? (
                    <div className="relative block h-33 w-50 cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-5 dark:bg-meta-4 sm:py-7.5">
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
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Image
                        className="h-33 w-50 object-cover"
                        src={file.previewUrl as string}
                        height={150}
                        width={200}
                        alt="image"
                      />
                    </div>
                  )}
                </div>
              )}
            </MultipleFileUpload>
            <div className="mt-1 text-xs text-meta-1">
              {errors.find((error) => error.for === "images")?.message}
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

export default AddRestaurantPage;
