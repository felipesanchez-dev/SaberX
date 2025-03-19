"use client";
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../components/utils/Heading";
import CreateCourse from "../../../components/Admin/Course/CreateCourse";
import DashboardHeader from "../../../components/Admin/DashboardHeader";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Heading title="Crear curso - SaberX" />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          {/* <CreateCourse /> */}
        </div>
      </div>
    </>
  );
};

export default page;
