import React, { FC } from "react";
import CoursePlayer from "../../utils/CoursePlayer";
import Ratings from "../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
};

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
}) => {
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
          <h1 className="pt-5 text-[30px] font-semibold text-green-500 animate-bounce">
            ¡Gratis!
          </h1>
          <div className="flex items-center justify-center">
            <button
              //   onClick={handleEnroll}
              className="w-[180px] my-3 font-Poppins text-center p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform duration-300 text-white shadow-md cursor-pointer"
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
          <p className="pb-1 text-gray-700 dark:text-gray-300">
            - Soporte 24/7
          </p>
        </div>
        <div className="w-full">
          <div className="w-full 800px:pr-5">
            <h1 className="text-[30px] font-Poppins font-bold text-gray-800 dark:text-white">
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
            <br />
            <h1 className="text-[20px] font-Poppins font-bold text-gray-800 dark:text-white">
              ¿Qué aprenderás en este curso?
            </h1>
          </div>
          {courseData?.benefits?.map((item: any, index: number) => (
            <div className="w-full flex items-center py-2" key={index}>
              <IoCheckmarkDoneOutline size={20} className="text-green-500" />
              <p className="pl-2 text-gray-700 dark:text-gray-300">
                {item.title}
              </p>
            </div>
          ))}
          <br />
          <h1 className="text-[20px] font-Poppins font-bold text-gray-800 dark:text-white">
            Requisitos previos
          </h1>
          {courseData?.prerequisites?.map((item: any, index: number) => (
            <div className="w-full flex items-center py-2" key={index}>
              <IoCheckmarkDoneOutline size={20} className="text-yellow-500" />
              <p className="pl-2 text-gray-700 dark:text-gray-300">
                {item.title}
              </p>
            </div>
          ))}
          <br />
          <div className="w-full text-gray-700 dark:text-gray-300">
            <h1 className="text-[24px] font-Poppins font-semibold text-gray-800 dark:text-white">
              Detalles del curso
            </h1>
            {courseData?.description}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 w-full px-4">
        <div
          className="flex items-center gap-2 px-6 py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all cursor-pointer text-sm sm:text-base"
          onClick={() => prevButton()}
        >
          <ArrowLeft className="w-5 h-5" /> Anterior
        </div>
        <div
          className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all cursor-pointer text-sm sm:text-base"
          onClick={() => createCourse()}
        >
          Terminar <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
export default CoursePreview;
