"use client";

import supabase from "@/utils/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaginationPage from "@/components/pagination/PaginatedPage";
import { getCookiesValue } from "@/utils/jwt-auth";

const RolesPage = () => {
  const [restaurantId, setRestaurantId] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [rolesData, setRolesData] = useState<any[]>([]);
  const [rolesCount, setRolesCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchRoles = async (page: number) => {
    try {
      const user = await getCookiesValue("login-info");
      const { data, error } = await supabase
        .from("roles")
        .select("id, name")
        .range((page - 1) * pageSize, pageSize * page - 1)
        .eq("restaurant_id", user.split("/")[2])
        .neq("restaurant_id", 0);

      if (error) throw error;

      setRolesData(data);
      setIsDataLoading(false);
    } catch (error) {
      console.log("Error while fetching roles: ", error);
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    fetchRoles(page);
  };

  const fetchCountRoles = async () => {
    try {
      const user = await getCookiesValue("login-info");
      const { data, error } = await supabase
        .from("roles")
        .select()
        .eq("restaurant_id", user.split("/")[2])
        .neq("restaurant_id", 0);

      if (error) throw error;

      setRolesCount(data.length);
    } catch (error) {
      console.log("Error while count roles: ", error);
    }
  };

  useEffect(() => {
    const setCookiesInfo = async () => {
      const user = await getCookiesValue("login-info");
      if (user.split("/")[2] != 0) setRestaurantId(user.split("/")[2]);
      setIsDataLoading(false);
    };

    setCookiesInfo();
    fetchCountRoles();
    fetchRoles(currentPage);
  }, [currentPage]);

  const deleteRecord = async (id: number) => {
    try {
      await supabase.from("roles").delete().eq("id", id).throwOnError();
      setRolesData(rolesData.filter((x) => x.id != id));
      fetchCountRoles();
    } catch (error) {
      console.error("Error while delete role: ", error);
    }
  };

  return (
    <section>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Roles
        </h2>
        {restaurantId > 0 ? (
          <Link
            href="roles/add"
            className="h-8 w-8 rounded-md bg-primary text-center text-2xl font-medium text-white shadow-default hover:bg-opacity-90"
          >
            +
          </Link>
        ) : (
          ""
        )}
      </div>
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
              You can not add roles.
            </h5>
            <ul>
              <li className="leading-relaxed text-[#CD5D5D]">
                First create space (restaurant / cafe) in your account.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="overflow-x-scroll">
          <table className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark min-w-115">
            <thead className="w-full">
              <tr className="flex py-5">
                <th className="w-1/4">Id</th>
                <th className="w-full">Name</th>
                <th className="w-full">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rolesData.map((role, key) => (
                <tr
                  className="flex border-t border-stroke py-4.5 dark:border-strokedark sm:grid-cols-8 "
                  key={key}
                >
                  <td className="flex w-1/4 items-center justify-center">
                    <p className="text-sm text-black dark:text-white">
                      {role.id}
                    </p>
                  </td>
                  <td className="flex w-full items-center justify-center">
                    <p className="text-sm text-black dark:text-white">
                      {role.name}
                    </p>
                  </td>
                  <td className="flex w-full items-center justify-center gap-5">
                    <Link
                      href={`roles/edit/${role.id}`}
                      className="text-green-600"
                    >
                      <svg
                        className="fill-current"
                        height="17"
                        width="17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="m455.1,137.9l-32.4,32.4-81-81.1 32.4-32.4c6.6-6.6 18.1-6.6 24.7,0l56.3,56.4c6.8,6.8 6.8,17.9 0,24.7zm-270.7,271l-81-81.1 209.4-209.7 81,81.1-209.4,209.7zm-99.7-42l60.6,60.7-84.4,23.8 23.8-84.5zm399.3-282.6l-56.3-56.4c-11-11-50.7-31.8-82.4,0l-285.3,285.5c-2.5,2.5-4.3,5.5-5.2,8.9l-43,153.1c-2,7.1 0.1,14.7 5.2,20 5.2,5.3 15.6,6.2 20,5.2l153-43.1c3.4-0.9 6.4-2.7 8.9-5.2l285.1-285.5c22.7-22.7 22.7-59.7 0-82.5z"></path>{" "}
                        </g>
                      </svg>
                    </Link>
                    <button
                      className="text-red"
                      onClick={() =>
                        confirm("Are you sure you want to delete this role?")
                          ? deleteRecord(role.id)
                          : ""
                      }
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isDataLoading ? (
        <div className="mt-8 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : !isDataLoading && rolesCount == 0 && restaurantId > 0 ? (
        <div className="mt-5 text-center">No data found</div>
      ) : (
        ""
      )}
      <PaginationPage
        currentPage={currentPage}
        totalProducts={rolesCount}
        perPage={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default RolesPage;
