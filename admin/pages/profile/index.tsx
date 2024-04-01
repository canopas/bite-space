"use client";

import Image from "next/image";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import SingleImgPreview from "@/components/ImagePreview/SingleImage";
import { getFilenameFromURL } from "@/utils/image";
import { z } from "zod";
import CryptoJS from "crypto-js";
import { getCookiesValue } from "@/utils/jwt-auth";

const Profile = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState<boolean>(false);
  const [isShowChangePwdPopup, showChangePwdPopup] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [imageData, setImageData] = useState<any | null>(null);
  const [image, setImage] = useState("");
  const [previewFileData, setPreviewFileData] = useState(
    {} as {
      previewType: string;
      previewUrl: string;
      previewName: string;
      isDragging: boolean;
    }
  );

  const fetchAdminData = async () => {
    try {
      const user = await getCookiesValue("login-info");

      const { data, error } = await supabase
        .from("admins")
        .select("id, name, email, password, image")
        .eq("id", user.split("/")[0])
        .single();

      if (error) throw error;

      setPreviewFileData({
        previewType: "image",
        previewUrl: data.image,
        previewName: "",
        isDragging: false,
      });

      setName(data.name);
      setEmail(data.email);
      setImage(data.image);
      setPassword(data.password);
    } catch (error) {
      console.error("Error while fetching admin: ", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleFileUploading = async (file: any) => {
    setImageData(file);
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      const mySchema = z.object({
        name: z.string().min(3),
        email: z.coerce.string().email().min(5),
        image: z.string().min(10, { message: "Image is required" }),
      });

      let image_url = image;

      if (imageData) {
        const currentDate = new Date();
        const { data: imgData, error: imgErr } = await supabase.storage
          .from("admins")
          .upload(currentDate.getTime() + "-" + imageData.name, imageData);

        if (imgErr) throw imgErr;

        if (image) {
          const { error } = await supabase.storage
            .from("admins")
            .remove([getFilenameFromURL(image)]);

          if (error) throw error;
        }

        image_url =
          process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
          "/admins/" +
          imgData.path;
      }

      setImage(image_url);

      const response = mySchema.safeParse({
        name: name,
        email: email,
        image: image_url,
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

      const user = await getCookiesValue("login-info");

      const { error } = await supabase.from("admins").upsert({
        id: user.split("/")[0],
        name: name,
        email: email,
        image: image_url,
        role: user.split("/")[1],
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error while saving profile data: ", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsPasswordChanging(true);
    try {
      const mySchema = z.object({
        password: z
          .string()
          .min(8, { message: "Password min 8 characters required" }),
        "new-password": z
          .string()
          .min(8, { message: "New password min 8 characters required" }),
      });

      const response = mySchema.safeParse({
        password: currentPassword,
        "new-password": newPassword,
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

      var decrypted = CryptoJS.AES.decrypt(
        password,
        process.env.NEXT_PUBLIC_CRYPTO_SECRET!
      ).toString(CryptoJS.enc.Utf8);

      if (decrypted !== currentPassword) {
        setErrors([
          {
            for: "password",
            message: "Password do not matched with current password",
          },
        ]);
        throw errors;
      }

      if (confirm("Are you sure you want to change password?")) {
        const user = await getCookiesValue("login-info");

        var encryptedPassword = CryptoJS.AES.encrypt(
          newPassword,
          process.env.NEXT_PUBLIC_CRYPTO_SECRET!
        ).toString();

        const { error } = await supabase.from("admins").upsert({
          id: user.split("/")[0],
          name: name,
          email: email,
          password: encryptedPassword,
        });

        if (error) throw error;

        setCurrentPassword("");
        setNewPassword("");
        setPassword(encryptedPassword);
        setErrors([]);

        showChangePwdPopup(true);
      }

      return;
    } catch (error) {
      console.error("Error while changing password: ", error);
    } finally {
      setIsPasswordChanging(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      showChangePwdPopup(false);
    }
  };

  const resetFormData = async () => {
    fetchAdminData();
  };

  return (
    <section>
      <div className="mx-auto max-w-242.5">
        {isShowChangePwdPopup ? (
          <div className="fixed z-[1] flex w-full max-w-242.5 gap-5 border-l-6 border-[#34D399] bg-green-100 px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="flex h-full w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <svg
                className="h-9"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="white"
                  stroke="white"
                ></path>
              </svg>
            </div>
            <div className="h-full w-full">
              <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399]">
                Password Changed Successfully
              </h5>
              <p className="text-sm leading-relaxed text-body">
                From now you can use your new password for login.
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="mb-6 flex gap-3 sm:items-center">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Profile
          </h2>
        </div>
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div
              className="relative mx-auto mt-10 h-30 w-30 rounded-full sm:h-44 sm:w-44"
              style={{ backgroundImage: `url(${previewFileData.previewUrl})` }}
            >
              <div className="relative h-full w-full rounded-full bg-black bg-opacity-20 p-3 backdrop-blur-sm">
                <Image
                  src={
                    previewFileData.previewUrl ??
                    "/images/user/user-profile.png"
                  }
                  width={160}
                  height={160}
                  alt="profile"
                  className="h-full w-full rounded-full object-cover"
                />
                <SingleImgPreview
                  uploadedFile={[previewFileData, setPreviewFileData]}
                  callback={handleFileUploading}
                >
                  <label className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                        fill=""
                      />
                    </svg>
                  </label>
                </SingleImgPreview>
              </div>
              <div className="mt-1 text-xs text-meta-1">
                {errors.find((error) => error.for === "image")?.message}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {name}
              </h3>
              <p className="font-normal">{email}</p>
            </div>
            <div className="p-7 pb-0">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
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
                      Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      placeholder="example@gmail.com"
                      required
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <div className="mt-1 text-xs text-meta-1">
                      {errors.find((error) => error.for === "email")?.message}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4.5">
                  <button
                    type="button"
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:cursor-wait disabled:opacity-30 dark:border-strokedark dark:text-white"
                    disabled={isFormLoading}
                    onClick={() => resetFormData()}
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
        <div className="col-span-5 mt-10 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                Change Password
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Current Password <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      placeholder="Your current password"
                      autoComplete="off"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-1 text-xs text-meta-1">
                    {errors.find((error) => error.for === "password")?.message}
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    New Password <span className="text-meta-1">*</span>
                  </label>
                  <input
                    className="w-full rounded border border-stroke px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="password"
                    placeholder="New password"
                    autoComplete="off"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div className="mt-1 text-xs text-meta-1">
                    {
                      errors.find((error) => error.for === "new-password")
                        ?.message
                    }
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button
                  className="rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-30"
                  onClick={() => handleChangePassword()}
                  disabled={isPasswordChanging}
                >
                  {isPasswordChanging ? "Changing..." : "Change"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
