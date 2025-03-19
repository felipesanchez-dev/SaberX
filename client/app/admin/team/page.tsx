"use client";
import React from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../components/utils/Heading";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AllUsers from "@/app/components/Admin/users/AllUsers";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Heading title="Equipo de trabajos - SaberX" />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <AllUsers isTeam={true} />
        </div>
      </div>
    </>
  );
};

export default page;
