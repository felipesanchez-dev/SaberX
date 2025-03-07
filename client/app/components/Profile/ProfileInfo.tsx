import Image from "next/image";
import React, { FC, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user ? user.name : "");
  const [background, setBackground] = useState("#ffffff1d");

  const imageHandler = async (e: any) => {
    console.log("Image changed");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Submit form");
  };

  return (
    <div
      className="w-full flex flex-col items-center p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all duration-300"
      style={{ background }}
    >
      {/* Avatar */}
      <div className="relative w-32 h-32">
        <Image
          src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
          alt="Avatar"
          width={128}
          height={128}
          className="w-full h-full object-cover border-4 border-teal-500 rounded-full"
        />
        <input
          type="file"
          id="avatar"
          className="hidden"
          onChange={imageHandler}
          accept="image/png, image/jpg, image/jpeg, image/webp"
        />
        <label htmlFor="avatar">
          <div className="absolute bottom-2 right-2 w-10 h-10 bg-gray-900 bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:scale-110 transition-all">
            <AiOutlineCamera size={22} className="text-white" />
          </div>
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-gray-200 pb-2 font-bold">
            Nombre de usuario
          </label>
          <input
            type="text"
            className="text-gray-800 dark:text-gray-200 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
            required
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 pb-2">
            Actualizar correo
          </label>
          <input
            type="text"
            readOnly
            className="text-gray-800 dark:text-gray-200 w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed shadow-sm"
            required
            value={user?.email}
          />
        </div>
        <input
          type="submit"
          value="Actualizar datos"
          className="w-full py-3 bg-teal-500 text-white rounded-md cursor-pointer hover:bg-teal-600 active:scale-95 font-semibold transition-all"
        />
      </form>
    </div>
  );
};

export default ProfileInfo;
