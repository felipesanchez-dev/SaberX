import React, { FC } from "react";
import CoursePlayer from "../../utils/CoursePlayer";
import toast from "react-hot-toast";
import Ratings from "../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import "./video.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
}) => {
  const handleEnroll = () => {
    toast.success(
      `¡Te has inscrito al curso "${courseData?.name}" exitosamente! 🎉`
    );
  };
  const prevButton = () => {
    setActive(active - 1);
  };
  const createCourse = () => {
    handleCourseCreate();
  };
  return (
    <div className="w-[80%] m-auto py-5 mb-5 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <div className="video-container rounded-lg overflow-hidden shadow-md">
            <CoursePlayer
              videoUrl={courseData?.demoUrl}
              title={courseData?.title || "Vista previa del curso"}
            />
          </div>
        </div>

        <h1 className="pt-5 text-[30px] font-semibold text-green-500 animate-bounce">
          ¡Gratis!
        </h1>

        <div className="flex items-center justify-center">
          <button
            onClick={handleEnroll}
            className="w-[180px] my-3 font-Poppins text-center p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform duration-300 text-white shadow-md"
          >
            ¡Inscribirse gratis!
          </button>
        </div>
        <p className="pb-1 text-gray-700 dark:text-gray-300">
          - Acceso a todo el material
        </p>
        <p className="pb-1 text-gray-700 dark:text-gray-300">
          - Acceso de por vida
        </p>
        <p className="pb-1 text-gray-700 dark:text-gray-300">
          - Certificado de finalización
        </p>
        <p className="pb-1 text-gray-700 dark:text-gray-300">- Soporte 24/7</p>
      </div>
      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[28px] font-Poppins font-semibold text-gray-800 dark:text-white">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5 className="text-gray-700 dark:text-gray-300 ml-2">
                0 reseñas
              </h5>
            </div>
          </div>
        </div>
        <br />
        <h1 className="text-[24px] font-Poppins font-semibold text-gray-800 dark:text-white">
          ¿Qué aprenderás en este curso?
        </h1>
      </div>
      {courseData?.benefits?.map((item: any, index: number) => (
        <div className="w-full flex items-center py-2" key={index}>
          <IoCheckmarkDoneOutline size={20} className="text-green-500" />
          <p className="pl-2 text-gray-700 dark:text-gray-300">{item.title}</p>
        </div>
      ))}
      <h1 className="text-[24px] font-Poppins font-semibold text-gray-800 dark:text-white">
        Requisitos previos
      </h1>
      {courseData?.prerequisites?.map((item: any, index: number) => (
        <div className="w-full flex items-center py-2" key={index}>
          <IoCheckmarkDoneOutline size={20} className="text-yellow-500" />
          <p className="pl-2 text-gray-700 dark:text-gray-300">{item.title}</p>
        </div>
      ))}
      <br />
      <div className="w-full text-gray-700 dark:text-gray-300">
        <h1 className="text-[24px] font-Poppins font-semibold text-gray-800 dark:text-white">
          Detalles del curso
        </h1>
        {courseData?.description}
      </div>
      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevButton}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Anterior
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createCourse}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all cursor-pointer"
        >
          Terminar <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default CoursePreview;
