"use client";
import Image from "next/image";
import React, { FC } from "react";
import avatarDefault from "../../../public/assets/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";

type Props = {
  user: {
    name?: string;
    avatar?: { url?: string };
  };
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  const userAvatar = user.avatar?.url || avatar || avatarDefault;
  const userName = user.name || "Usuario";

  return (
    <div className="w-[280px] h-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl flex flex-col items-center py-6 transition-all border border-gray-200 dark:border-gray-700 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Mi Cuenta
      </h2>
      <br />
      <div
        className={`w-[90%] flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
          ${
            active === 1
              ? "bg-amber-50 text-white shadow-lg"
              : "hover:bg-amber-50 hover:text-white dark:hover:bg-amber-50"
          } 
          bg-gray-100 dark:bg-gray-800 dark:text-white`}
        onClick={() => setActive(1)}
      >
        <Image
          src={userAvatar}
          width={55}
          height={55}
          alt={`${userName} Avatar`}
          className="w-[55px] h-[55px] rounded-full object-cover border-2"
        />
        <span className="text-lg font-semibold font-Poppins text-gray-800 dark:text-white">
          {userName}
        </span>
      </div>
      <br />
      <div
        className={`w-[90%] flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
          ${
            active === 2
              ? "bg-[#ffffff2d] text-white shadow-lg"
              : "hover:bg[#ffffff2d] hover:text-white dark:hover:bg-[#ffffff2d]"
          } 
          bg-gray-100 dark:bg-gray-800 dark:text-white`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} fill="#fff" /> Cambiar contraseña
      </div>
      <br />
      <div
        className={`w-[90%] flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
          ${
            active === 3
              ? "bg-[#ffffff2d] text-white shadow-lg"
              : "hover:bg[#ffffff2d] hover:text-white dark:hover:bg-[#ffffff2d]"
          } 
          bg-gray-100 dark:bg-gray-800 dark:text-white`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} fill="#fff" /> Mis cursos
      </div>
      <br />
      <div
        className={`w-[90%] flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
          ${
            active === 4
              ? "bg-[#ffffff2d] text-white shadow-lg"
              : "hover:bg[#ffffff2d] hover:text-white dark:hover:bg-[#ffffff2d]"
          } 
          bg-gray-100 dark:bg-gray-800 dark:text-white`}
        onClick={() => logOutHandler()}
      >
        <AiOutlineLogout size={20} fill="#fff" /> Cerrar Sesion
      </div>
    </div>
  );
};

export default SideBarProfile;
