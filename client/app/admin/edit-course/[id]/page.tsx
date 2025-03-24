"use client";
import React from "react";
import { useParams } from "next/navigation";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../components/utils/Heading";
import EditCourse from "../../../components/Admin/Course/EditCourse";
import DashboardHeader from "../../../components/Admin/DashboardHeader";

type Params = {
  id: string;
};

const Page: React.FC = () => {
  const params = useParams() as Params;
  const { id } = params;

  return (
    <>
      <Heading title="Editar curso - SaberX" />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <EditCourse id={id} />
        </div>
      </div>
    </>
  );
};

export default Page;
