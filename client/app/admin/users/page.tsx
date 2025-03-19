"use client";
import Heading from "../../components/utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AllUsers from "../../components/Admin/users/AllUsers";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Heading title="Ver usuarios - SaberX" />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[95%]">
          <DashboardHeader />
          <AllUsers />
        </div>
      </div>
    </>
  );
};

export default page;
