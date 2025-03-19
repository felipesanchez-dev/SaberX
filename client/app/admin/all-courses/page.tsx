"use client";
import Heading from "../../components/utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AllCourses from "../../components/Admin/Course/AllCourses";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Heading title="Ver cursos - SaberX" />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[95%]">
          {/* <DashboardHeader /> */}
          <AllCourses />
        </div>
      </div>
    </>
  );
};

export default page;
