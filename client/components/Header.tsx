'use client'
import Link from "next/link";
import React, { FC, useState, useEffect, useCallback } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
// import { ThemeSwitcher } from "../utils/ThemeSwitcher";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
};

const Header: FC<Props> = ({ activeItem, setOpen }) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    const handleClose = useCallback((e: any) => {
        if (e.target.id === "screen") {
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
                        <div>
                            <Link
                                href={"/"}
                                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                            >
                                ꕶaber✘
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <NavItems activeItem={activeItem} isMobile={false} className="text-black dark:text-white" />
                            
                            {/* Botón para el cambio de tema (Desactivado por mal funcionamiento) */}
                            {/* <ThemeSwitcher /> */}

                            <div className="md:hidden flex items-center justify-center">
                                <HiOutlineMenuAlt3 
                                    size={25}
                                    className="cursor-pointer text-black dark:text-white"
                                    onClick={() => setOpenSidebar(true)} 
                                />
                            </div>
                            <HiOutlineUserCircle 
                                size={25}
                                className="hidden md:block cursor-pointer text-black dark:text-white"
                                onClick={() => setOpen(true)}
                            />
                        </div>
                    </div>
                </div>
                {openSidebar && (
                    <div className="fixed inset-0 z-[99999] bg-[#00000024] dark:bg-opacity-90" onClick={handleClose} id="screen">
                        <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 p-5">
                            <NavItems className="text-black dark:text-white" 
                            activeItem={activeItem} 
                            isMobile={true} />
                            <HiOutlineUserCircle 
                                size={25}
                                className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                                onClick={() => setOpen(true)}
                            />
                            <br />
                            <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                Copyright 2025 SaberX
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;