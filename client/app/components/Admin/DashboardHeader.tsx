"use client";
import React, { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

type Props = {};

const DashboardHeader: FC<Props> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white font-bold">
          1
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-[350px] h-auto max-h-[60vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-14 right-5 rounded-lg overflow-hidden border dark:border-[#2d3a4e] border-gray-200"
          >
            <h5 className="text-center text-[18px] font-semibold text-black dark:text-white p-4 border-b dark:border-[#ffffff27] border-gray-300">
              Notificaciones
            </h5>
            <div className="dark:bg-[#2d3a4ea1] bg-[#f9f9f9] p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-black dark:text-white font-medium">
                  Nueva pregunta recibida
                </p>
                <button className="text-[#3ccba0] hover:text-[#2aa37e] text-sm font-medium">
                  Marcar como leído
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Deserunt, sequi! Tempore libero omnis et, ea beatae ut, itaque.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                Hace 5 días
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHeader;
