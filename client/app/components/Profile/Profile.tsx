"use client";
import React, { FC, useState, useEffect } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { motion } from "framer-motion";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useLogOutQuery(undefined, {
    skip: !logout,
  });

  const logOutHandler = async () => {
    setIsLoggingOut(true);
    setLogout(true);
    await signOut();

    setTimeout(() => {
      router.push("/");
    }, 400);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-[85%] flex flex-col md:flex-row mx-auto transition-opacity duration-500"
    >
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-[60px] md:w-[310px] h-auto md:h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#ffffff2d] rounded-[5px] shadow-sm mt-[40px] md:mt-[80px] mb-[40px] md:mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-30px]"
        }`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </motion.div>
      {active === 1 && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full bg-transparent mt-[40px] md:mt-[80px]"
        >
          <ProfileInfo avatar={avatar} user={user} />
        </motion.div>
      )}
      {active === 2 && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full bg-transparent mt-[40px] md:mt-[80px]"
        >
          <ChangePassword />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
