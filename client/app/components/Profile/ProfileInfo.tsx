"use client";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import avatarIcon from "../../../public/assets/avatar.png";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const { refetch } = useLoadUserQuery({});

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      if (fileReader.readyState === 2 && fileReader.result) {
        setLoading(true);
        try {
          await updateAvatar(fileReader.result);
        } catch (err) {
          console.error("Error actualizando avatar:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
    if (error) {
      console.error("Error:", error);
    }
  }, [isSuccess, error, refetch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit form");
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="relative w-32 h-32 mx-auto group">
        <div className="relative w-full h-full">
          <Image
            src={user?.avatar?.url || avatar || avatarIcon}
            alt="Avatar"
            width={128}
            height={128}
            priority={true}
            className="w-full h-full object-cover border-4 border-teal-500 rounded-full shadow-lg transition-all duration-300 group-hover:ring-4 group-hover:ring-teal-400 group-hover:shadow-2xl"
          />
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <ImSpinner2 className="text-white text-3xl animate-spin" />
            </div>
          )}
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-gray-900 bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:scale-110 transition-all">
              <AiOutlineCamera size={22} className="text-white" />
            </div>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-gray-800 dark:text-gray-200 pb-2 font-bold">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all  text-gray-800 dark:text-gray-200"
              required
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 pb-2 font-semibold">
              Correo electrónico
            </label>
            <input
              type="text"
              readOnly
              className=" text-gray-800 dark:text-gray-200 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed shadow-sm"
              required
              value={user?.email}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-teal-500 text-white rounded-lg cursor-pointer relative overflow-hidden font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <ImSpinner2 className="animate-spin mx-auto text-2xl" />
          ) : (
            <span className="relative z-10">Actualizar datos</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
