"use client";
import Image from "next/image";
import React, { FC } from "react";
import avatarDefault from "../../../public/assets/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: {
    name?: string;
    avatar?: { url?: string };
    role?: string;
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
    <div className="w-[280px] h-full bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg flex flex-col items-center py-6 border border-gray-300 dark:border-gray-700 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 text-center px-4">
        ¡Hola, <span className="font-bold">{userName}</span>! Administra tu
        cuenta fácilmente desde aquí.
      </h2>

      <div className="w-[90%] mt-5 flex flex-col gap-3">
        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all text-gray-800 dark:text-gray-200 ${
            active === 1
              ? "bg-[#7b8f8a] text-white shadow-md"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActive(1)}
        >
          <Image
            src={userAvatar}
            width={45}
            height={45}
            alt={`${userName} Avatar`}
            className="w-[45px] h-[45px] rounded-full object-cover border-2"
          />
          <span className="text-md font-medium">Editar perfil</span>
        </button>

        {user.role === "admin" && (
          <Link href="/admin">
            <button
              className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
                active === 6
                  ? "bg-[#7b8f8a] text-white shadow-md"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setActive(6)}
            >
              <MdAdminPanelSettings size={20} />
              <span className="text-md font-medium">
                Panel de control admin
              </span>
            </button>
          </Link>
        )}

        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            active === 2
              ? "bg-[#7b8f8a] text-white shadow-md"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => setActive(2)}
        >
          <RiLockPasswordLine size={20} />
          <span className="text-md font-medium">Cambiar contraseña</span>
        </button>

        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            active === 3
              ? "bg-[#7b8f8a] text-white shadow-md"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => setActive(3)}
        >
          <SiCoursera size={20} />
          <span className="text-md font-medium">Mis cursos</span>
        </button>

        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            active === 4
              ? "bg-red-500 text-white shadow-md"
              : "hover:bg-red-500 hover:text-white text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => logOutHandler()}
        >
          <AiOutlineLogout size={20} />
          <span className="text-md font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default SideBarProfile;
