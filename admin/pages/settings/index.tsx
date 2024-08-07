"use client";

import Image from "next/image";
import supabase from "@/utils/supabase";
import {
  changeFileExtensionToWebpExtension,
  convertToWebP,
  deleteFileFroms3,
  uploadFileTos3,
} from "@/utils/image";
import { useEffect, useState } from "react";
import MultipleFileUpload from "@/components/ImagePreview/MultipleImage";
import { z } from "zod";
import { TagsInput } from "react-tag-input-component";
import { getCookiesValue, setSessionForUser } from "@/utils/jwt-auth";

const week_days_list = [
  {
    day: "Sun",
    value: 1,
  },
  {
    day: "Mon",
    value: 2,
  },
  {
    day: "Tue",
    value: 3,
  },
  {
    day: "Wed",
    value: 4,
  },
  {
    day: "Thu",
    value: 5,
  },
  {
    day: "Fri",
    value: 6,
  },
  {
    day: "Sat",
    value: 7,
  },
];

const Settings = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const [role, setRole] = useState<string>("");

  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [localArea, setLocalArea] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [postalCode, setPostalCode] = useState<number>(0);
  const [country, setCountry] = useState<string>("India");
  const [phone, setPhone] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [imagesData, setImagesData] = useState<any[]>([]);
  const new_images: string[] = [];
  const [uploadedFiles, setUploadedFilesData] = useState<
    Array<{
      previewType: string;
      previewUrl: string;
      previewName: string;
    }>
  >();

  const manageAccountImages = async (data: any) => {
    setImages(data);
    if (data) {
      let arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({
          previewType: "",
          previewUrl: data[i],
          previewName: "",
        });
      }
      setUploadedFilesData(arr);
    }
  };

  const fetchRestaurantData = async (isSetImages: boolean) => {
    try {
      const user = await getCookiesValue("login-info");
      setRole(user.split("/")[1]);

      const { data, error } = await supabase
        .from("restaurants")
        .select(
          "id, name, description, address, local_area, city, state, postal_code, country, phone, images, tags, week_days, start_time, end_time, is_public"
        )
        .eq("id", user.split("/")[2])
        .single();

      if (error) throw error;

      setId(data.id);
      setName(data.name);
      setDescription(data.description);
      setAddress(data.address);
      setLocalArea(data.local_area);
      setCity(data.city);
      setState(data.state);
      setPostalCode(data.postal_code);
      setCountry(data.country);
      setPhone(data.phone);
      setTags(data.tags);
      setWeekDays(data.week_days);
      setStartTime(data.start_time);
      setEndTime(data.end_time);
      setIsPublic(data.is_public);

      isSetImages ? await manageAccountImages(data.images) : "";
    } catch (error) {
      console.error("Error while fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchRestaurantData(true);
  }, []);

  const handleFilesUploading = async (files: any) => {
    setImagesData(files);
  };

  const handleImageUpload = async (e: any) => {
    e.preventDefault();
    setIsImageLoading(true);

    try {
      const mySchema = z.object({
        images: z
          .array(z.string().min(10))
          .min(1, { message: "Images is required" }),
      });

      let arr: string[] = [];
      if (imagesData) {
        for (var i = 0; i < imagesData.length; i++) {
          const currentDate = new Date();

          if (imagesData[i].previewUrl) {
            arr.push(imagesData[i].previewUrl);
            new_images.push(imagesData[i].previewUrl);
          } else {
            const webpBlob = await convertToWebP(imagesData[i]);

            const image_url = await uploadFileTos3(
              "restaurants",
              webpBlob,
              currentDate.getTime() +
                "-" +
                changeFileExtensionToWebpExtension(imagesData[i].name)
            );

            new_images.push(image_url);
          }
        }
      }

      if (images && arr.length > 0) {
        const removeImages = images.filter(
          (item: string) => !arr.includes(item)
        );

        for (var i = 0; i < removeImages.length; i++) {
          await deleteFileFroms3(removeImages[i]);
        }
      }

      const response = mySchema.safeParse({
        images: new_images,
      });

      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message });
        }
        setErrors(errArr);
        throw err;
      }

      const { error } = await supabase.from("restaurants").upsert({
        id: id,
        address: address,
        local_area: localArea,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        images: new_images,
      });

      if (error) throw error;

      setErrors([]);
    } catch (error) {
      console.error("Error while uploading images: ", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsFormLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3),
        phone: z.number().positive().min(10),
        address: z.string().min(10),
        local_area: z.string().min(3),
        city: z.string().min(3),
        state: z.string().min(3),
        postal_code: z.number().positive().min(5),
        country: z.string().min(3),
        tags: z
          .array(z.string().min(3))
          .min(1, { message: "Tags is required" }),
        description: z.string().min(5),
        // week_days: z
        //   .array(z.number().gt(0))
        //   .min(1, { message: "Week days is required" }),
        // start_time: z.string().min(5),
        // end_time: z.string().min(5),
      });

      const response = mySchema.safeParse({
        name: name,
        phone: parseInt(phone),
        address: address,
        local_area: localArea,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        tags: tags,
        description: description,
        // week_days: weekDays,
        // start_time: startTime,
        // end_time: endTime,
      });

      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message });
        }
        setErrors(errArr);
        throw err;
      }

      setErrors([]);

      const { error } = await supabase.from("restaurants").upsert({
        id: id,
        name: name,
        description: description,
        address: address,
        local_area: localArea,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        tags: tags.map((tag) => tag.toLowerCase()),
        phone: parseInt(phone),
        // week_days: weekDays,
        // start_time: startTime,
        // end_time: endTime,
        is_public: isPublic,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error while saving data: ", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const setIsWeekDayChecked = async (day: number) => {
    setWeekDays([...weekDays, day]);
  };

  const deleteAccount = async () => {
    setIsDeleteLoading(true);
    try {
      // get restaurant data
      const { data: restaurant, error: restaurantErr } = await supabase
        .from("restaurants")
        .select("id, images")
        .eq("id", id)
        .single();

      if (restaurantErr) throw restaurantErr;

      // get menus data
      const { data: menus, error: menusErr } = await supabase
        .from("menus")
        .select("id")
        .eq("restaurant_id", restaurant.id);

      if (menusErr) throw menusErr;

      for (var i = 0; i < menus.length; i++) {
        // get dishes by menu
        const { data: dishes, error: dishesErr } = await supabase
          .from("dishes")
          .select("id, images, video")
          .eq("menu_id", menus[i]?.id);

        if (dishesErr) throw dishesErr;

        for (var j = 0; j < dishes.length; j++) {
          // delete dish images
          if (dishes[i].images) {
            for (var i = 0; i < dishes[i].images.length; i++) {
              await deleteFileFroms3(dishes[i].images[i]);
            }
          }

          // delete dish video
          if (dishes[i].video) {
            await deleteFileFroms3(dishes[i].video);
          }

          // delete dish
          await supabase
            .from("dishes")
            .delete()
            .eq("id", dishes[i].id)
            .throwOnError();
        }

        // delete menu
        await supabase
          .from("menus")
          .delete()
          .eq("id", menus[i].id)
          .throwOnError();
      }

      // delete categories
      await supabase
        .from("menus_sections")
        .delete()
        .eq("restaurant_id", restaurant.id)
        .throwOnError();

      // delete from admins_roles_restaurants
      await supabase
        .from("admins_roles_restaurants")
        .delete()
        .eq("restaurant_id", restaurant.id)
        .throwOnError();

      // delete invitations
      await supabase
        .from("pending_invitations")
        .delete()
        .eq("invited_for", restaurant.id)
        .throwOnError();

      // delete roles
      await supabase
        .from("roles")
        .delete()
        .eq("restaurant_id", restaurant.id)
        .throwOnError();

      // delete restaurant images
      if (restaurant.images) {
        for (var i = 0; i < restaurant.images.length; i++) {
          await deleteFileFroms3(restaurant.images[i]);
        }
      }

      // delete restaurant
      await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurant.id)
        .throwOnError();

      const user = await getCookiesValue("login-info");
      await setSessionForUser(
        "login-info",
        user.split("/")[0] + "/" + user.split("/")[1] + "/" + 0
      );

      window.location.replace(process.env.NEXT_PUBLIC_ADMIN_BASE_URL!);
    } catch (error) {
      console.error("Error while deleting account: ", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const resetFormData = async (forImages: boolean) => {
    fetchRestaurantData(forImages);
  };

  return (
    <section>
      <div className="mx-auto max-w-270">
        <div className="mb-6 flex gap-3 sm:items-center">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Account Settings
          </h2>
        </div>
        <div className="flex flex-col gap-8">
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-semibold text-black dark:text-white">
                  Photos
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleImageUpload}>
                  <MultipleFileUpload
                    uploadedFiles={uploadedFiles}
                    callback={handleFilesUploading}
                  >
                    {(file: any) => (
                      <div className="flex items-center justify-center">
                        {!file.previewUrl ? (
                          <div className="relative block h-26 w-40 cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-3 dark:bg-meta-4">
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
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Image
                              className="h-26 w-40 object-cover"
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

                  <div className="mt-10 flex justify-end gap-4.5">
                    <button
                      type="button"
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:cursor-wait disabled:opacity-30 dark:border-strokedark dark:text-white"
                      disabled={isImageLoading}
                      onClick={() => resetFormData(true)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                      type="submit"
                      disabled={isImageLoading}
                    >
                      {isImageLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-semibold text-black dark:text-white">
                  Account Information
                </h3>
              </div>
              <div className="p-7">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-5.5"
                >
                  <div className="flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name <span className="text-meta-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          placeholder="Devid Jhon"
                          defaultValue="Devid Jhon"
                          required
                          autoComplete="off"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div className="mt-1 text-xs text-meta-1">
                        {errors.find((error) => error.for === "name")?.message}
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Phone Number <span className="text-meta-1">*</span>
                      </label>
                      <input
                        className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        placeholder="+990 3343 7865"
                        required
                        autoComplete="off"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone?.toString()}
                      />
                      <div className="mt-1 text-xs text-meta-1">
                        {errors.find((error) => error.for === "phone")?.message}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        rows={5}
                        placeholder="Write your address here"
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
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
                          defaultValue="Katargam"
                          required
                          autoComplete="off"
                          onChange={(e) => setLocalArea(e.target.value)}
                          value={localArea}
                        />
                      </div>
                      <div className="mt-1 text-xs text-meta-1">
                        {
                          errors.find((error) => error.for === "localArea")
                            ?.message
                        }
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
                        value={city}
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
                          defaultValue="Gujarat"
                          required
                          autoComplete="off"
                          onChange={(e) => setState(e.target.value)}
                          value={state}
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
                        onChange={(e) =>
                          setPostalCode(parseInt(e.target.value))
                        }
                        value={postalCode}
                      />
                      <div className="mt-1 text-xs text-meta-1">
                        {
                          errors.find((error) => error.for === "postalCode")
                            ?.message
                        }
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
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
                        value={country}
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
                      Description <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        rows={5}
                        placeholder="Write your description here"
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      ></textarea>
                    </div>
                    <div className="mt-1 text-xs text-meta-1">
                      {
                        errors.find((error) => error.for === "description")
                          ?.message
                      }
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
                        onChange={(e) => setIsPublic(e.target.value === "true")}
                        className="h-5 w-5 accent-orange-600 cursor-pointer"
                      />
                      <label htmlFor="private" className="cursor-pointer">
                        Private
                      </label>
                    </div>
                  </div>

                  {/* <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Opening Week Days <span className="text-meta-1">*</span>
                    </label>
                    <div className="flex flex-wrap gap-5">
                      {week_days_list.map((week, key) => (
                        <label
                          htmlFor={"week-" + week.value}
                          className="flex cursor-pointer select-none items-center"
                          key={key}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              id={"week-" + week.value}
                              className="sr-only"
                              onChange={() => {
                                setIsWeekDayChecked(week.value);
                              }}
                            />
                            <div
                              className={`flex h-10 w-20 items-center justify-center rounded-full border transition duration-500 ${
                                weekDays?.find((day) => day == week.value)
                                  ? "border-2 border-green-600 font-bold text-green-600"
                                  : "border-slate-400 text-slate-500"
                              }`}
                            >
                              {week.day}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-meta-1">
                      {
                        errors.find((error) => error.for === "week_days")
                          ?.message
                      }
                    </div>
                  </div> */}

                  {/* <div className="flex flex-wrap gap-5.5">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Start Time <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="time"
                        className="w-50 rounded border border-stroke"
                        onChange={(e) => setStartTime(e.target.value)}
                        value={startTime}
                      />
                      <div className="mt-1 text-xs text-meta-1">
                        {
                          errors.find((error) => error.for === "start_time")
                            ?.message
                        }
                      </div>
                    </div>
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        End Time <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="time"
                        className="w-50 rounded border border-stroke"
                        onChange={(e) => setEndTime(e.target.value)}
                        value={endTime}
                      />
                      <div className="mt-1 text-xs text-meta-1">
                        {
                          errors.find((error) => error.for === "end_time")
                            ?.message
                        }
                      </div>
                    </div>
                  </div> */}

                  <div className="flex justify-end gap-4.5">
                    <button
                      type="button"
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:cursor-wait disabled:opacity-30 dark:border-strokedark dark:text-white"
                      disabled={isFormLoading}
                      onClick={() => resetFormData(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                      type="submit"
                      disabled={isFormLoading}
                    >
                      {isFormLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {role == "admin" ? (
            <div className="col-span-5 xl:col-span-2">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    🔴 Delete Account
                  </h3>
                </div>
                <div className="p-7">
                  <div className="font-bold text-black">
                    {" "}
                    This action cannot be undone, and all your data will be
                    lost.{" "}
                    <span className="font-normal">
                      Still want to delete your account?
                    </span>
                  </div>
                  <div className="text-right">
                    <button
                      className="rounded bg-meta-1 px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                      onClick={() =>
                        confirm("Are you sure you want to delete this account?")
                          ? deleteAccount()
                          : ""
                      }
                      disabled={isDeleteLoading}
                    >
                      {isDeleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};

export default Settings;
