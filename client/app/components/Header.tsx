"use client";
import Link from "next/link";
import React, { FC, useState, useEffect, useCallback } from "react";
import NavItems from "./utils/NavItems";
// import { ThemeSwitcher } from "./utils/ThemeSwitcher";
import CustomModal from "./utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "screen") {
      setOpenSidebar(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative text-black dark:text-white">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* Logo */}
            <Link
              href="/"
              className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
            >
              SABER ✘
            </Link>

            <div className="flex items-center">
              <NavItems
                activeItem={activeItem}
                isMobile={false}
                className="text-black dark:text-white"
              />
              <div className="md:hidden flex items-center justify-center">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer text-black dark:text-white"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {/* <ThemeSwitcher /> */}
              <HiOutlineUserCircle
                size={25}
                className="hidden md:block cursor-pointer text-black dark:text-white"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {openSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-[#00000024] dark:bg-opacity-90"
              onClick={handleClose}
              id="screen"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 p-5 shadow-lg"
              >
                <div className="flex justify-between items-center mb-5">
                  <p className="text-xl font-bold text-black dark:text-white"></p>
                  <HiX
                    size={30}
                    className="cursor-pointer text-black dark:text-white"
                    onClick={() => setOpenSidebar(false)}
                  />
                </div>
                <NavItems
                  className="text-black dark:text-white"
                  activeItem={activeItem}
                  isMobile={true}
                />
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                  onClick={() => setOpen(true)}
                />
                <br />
                <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                  © {new Date().getFullYear()} <span>SABER ✘</span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}
      {route === "Sign-Up" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}
      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
