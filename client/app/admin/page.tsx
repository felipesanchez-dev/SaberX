"use client";
import React from "react";
import Heading from "../components/utils/Heading";
import { useSelector } from "react-redux";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import DeshboarHero from "../components/Admin/DeshboarHero";

type Props = {};

const page = (props: Props) => {
  const { user } = useSelector((state: any) => state.auth);
  return (
    <>
      <Heading
        title={`Panel de Administración - Bienvenido, ${user.name} | SaberX
`}
      />
      <div className="flex h-[200vh]">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DeshboarHero />
        </div>
      </div>
    </>
  );
};

export default page;
