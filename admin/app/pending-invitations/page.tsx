"use client";

import supabase from "@/utils/supabase";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import PaginationPage from "@/components/pagination/PaginatedPage";
import { getCookiesValue } from "@/utils/jwt-auth";

const PendingInvitationsPage = () => {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [invitationsData, setInvitationsData] = useState<any[]>([]);
  const [invitationsCount, setInvitationsCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchPendingInvitations = async (page: number) => {
    const user = await getCookiesValue("login-info");
    const { data: userData, error: userError } = await supabase
      .from("admins")
      .select("id, email")
      .eq("id", user.split("/")[0])
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("pending_invitations")
      .select("*, admins(name, email), restaurants(id, name), roles(id, name)")
      .range((page - 1) * pageSize, pageSize * page - 1)
      .eq("email", userData.email);

    if (error) throw error;

    setInvitationsData(data);
    setIsDataLoading(false);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    fetchPendingInvitations(page);
  };

  const fetchCountPendingInvitations = async () => {
    const user = await getCookiesValue("login-info");
    const { data: userData, error: userError } = await supabase
      .from("admins")
      .select("id, email")
      .eq("id", user.split("/")[0])
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("pending_invitations")
      .select()
      .eq("email", userData.email);

    if (error) throw error;

    setInvitationsCount(data.length);
  };

  useEffect(() => {
    fetchCountPendingInvitations();
    fetchPendingInvitations(currentPage);
  }, []);

  const acceptInvitation = async (
    id: number,
    roleId: number,
    restaurantId: number,
  ) => {
    try {
      const user = await getCookiesValue("login-info");
      const { error } = await supabase.from("admins_roles_restaurants").insert({
        admin_id: user.split("/")[0],
        role_id: roleId,
        restaurant_id: restaurantId,
      });

      if (error) throw error;

      await supabase
        .from("pending_invitations")
        .delete()
        .eq("id", id)
        .throwOnError();

      window.location.reload();
    } catch (error) {
      console.error("error", error);
    }
  };

  const rejectInvitation = async (id: number) => {
    try {
      await supabase
        .from("pending_invitations")
        .delete()
        .eq("id", id)
        .throwOnError();

      setInvitationsData(invitationsData.filter((x) => x.id != id));
      fetchCountPendingInvitations();
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Pending Invitations
        </h2>
      </div>
      <table className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <thead className="w-full">
          <tr className="flex py-5">
            <th className="w-1/4">Id</th>
            <th className="w-full">Invited By</th>
            <th className="w-full">Invited For</th>
            <th className="w-full">Role</th>
            <th className="w-full">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invitationsData.map((invite, key) => (
            <tr
              className="flex border-t border-stroke py-4.5 dark:border-strokedark sm:grid-cols-8 "
              key={key}
            >
              <td className="flex w-1/4 items-center justify-center">
                <p className="text-sm text-black dark:text-white">
                  {invite.id}
                </p>
              </td>
              <td className="flex w-full items-center justify-center">
                <p className="text-sm text-black dark:text-white">
                  {invite.admins.name}
                </p>
              </td>
              <td className="flex w-full items-center justify-center">
                <p className="text-sm text-black dark:text-white">
                  {invite.restaurants.name}
                </p>
              </td>
              <td className="flex w-full items-center justify-center">
                <p className="text-sm text-black dark:text-white">
                  {invite.roles.name}
                </p>
              </td>
              <td className="flex w-full items-center justify-center gap-5">
                <button
                  className="rounded-xl border border-blue-600 px-3 py-2 text-blue-600 transition duration-500 hover:bg-blue-600 hover:text-white"
                  onClick={() =>
                    acceptInvitation(
                      invite.id,
                      invite.roles.id,
                      invite.restaurants.id,
                    )
                  }
                >
                  Accept
                </button>
                <button
                  className="rounded-xl border border-meta-1 px-3 py-2 text-meta-1 transition duration-500 hover:bg-meta-1 hover:text-white"
                  onClick={() =>
                    confirm("Are you sure you want to reject this invitation?")
                      ? rejectInvitation(invite.id)
                      : ""
                  }
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDataLoading ? (
        <div className="mt-8 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : !isDataLoading && invitationsCount == 0 ? (
        <div className="mt-5 text-center">No data found</div>
      ) : (
        ""
      )}
      <PaginationPage
        currentPage={currentPage}
        totalProducts={invitationsCount}
        perPage={pageSize}
        onPageChange={onPageChange}
      />
    </DefaultLayout>
  );
};

export default PendingInvitationsPage;
