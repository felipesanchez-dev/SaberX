import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handlleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData?.length || 0).fill(false)
  );

  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    const currentItem = { ...updatedData[index] };
    currentItem.links = currentItem.links ? [...currentItem.links] : [];
    currentItem.links.push({ title: "", url: "" });
    updatedData[index] = currentItem;
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error(
        "Es necesario rellenar todos los campos para crear mas contenido"
      );
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: `Nueva seccion ${courseContentData.length + 1}`,
        description: "",
        videoSection: `Contenido ${courseContentData.length + 1}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoSection === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error(
        "Es necesario rellenar todos los campos en la sección anterior para crear una nueva"
      );
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Nueva seccion ${activeSection}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoSection === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Es necesario rellenar todos los campos para avanzar");
    } else {
      setActive(active + 1);
      handlleCourseSubmit();
    }
  };
  console.log("test", courseContentData);

  return (
    <div className="w-[80%] mx-auto mt-24 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} action={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <div
              key={index}
              className={`w-full p-5 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all mt-10`}
            >
              <div className="flex w-full items-center gap-2">
                <input
                  type="text"
                  className={`text-lg font-semibold px-2 py-1 transition-all duration-200 ${
                    item.videoSection === "Seccion"
                      ? "w-[200px]"
                      : "w-[auto] min-w-[200px] max-w-full"
                  } font-Poppins cursor-text bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white`}
                  value={item.videoSection}
                  onChange={(e) => {
                    const updatedData = [...courseContentData];
                    updatedData[index].videoSection = e.target.value;
                    setCourseContentData(updatedData);
                  }}
                />
                <BiSolidPencil className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition duration-200" />
              </div>
              <br />
              <div className="flex w-full items-center justify-between">
                {isCollapsed[index] ? (
                  <>
                    {item.title ? (
                      <p className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {item.title}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <div></div>
                )}
                <div className="flex items-center">
                  <AiOutlineDelete
                    className={`text-xl mr-2 text-red-500 ${
                      index > 0
                        ? "cursor-pointer hover:text-red-700 transition"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    onClick={() => {
                      if (index > 0) {
                        const updatedData = [...courseContentData];
                        updatedData.splice(index, 1);
                        setCourseContentData(updatedData);
                      }
                    }}
                  />
                  <MdOutlineKeyboardArrowDown
                    fontSize="large"
                    className="text-gray-700 dark:text-white cursor-pointer transition-transform"
                    style={{
                      transform: isCollapsed[index]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(index)}
                  />
                </div>
              </div>
              {isCollapsed[index] && (
                <>
                  <div className="mt-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Titulo del video
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del video"
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      value={item.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].title = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <br />
                  <div className="mb-3">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Ingrese el video del curso (ID)
                    </label>
                    <input
                      type="text"
                      placeholder="ID del video"
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={item.videoUrl}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoUrl = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <br />
                  <div className="mb-3">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Descripcion del video
                    </label>
                    <textarea
                      rows={8}
                      cols={30}
                      placeholder=""
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none !h-min py-2"
                      value={item.description}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].description = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  {item?.links.map((link: any, linkIndex: number) => (
                    <div className="mb-3 block" key={index}>
                      <div className="w-full flex items-center justify-between">
                        <label
                          className="block text-gray-700 dark:text-gray-300 font-medium mb-1 mr-2"
                          htmlFor={`link-${index + 1}`}
                        >
                          Link {linkIndex + 1}
                        </label>
                        <AiOutlineDelete
                          className={`text-xl mr-2 text-red-500 ${
                            linkIndex === 0
                              ? "cursor-pointer hover:text-red-700 transition"
                              : "cursor-pointer opacity-50"
                          }`}
                          onClick={() =>
                            linkIndex === 0
                              ? null
                              : handleRemoveLink(index, linkIndex)
                          }
                        />
                      </div>
                      <div className="w-full flex flex-wrap items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del link "
                          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={link.title}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].title =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                        <input
                          type="url"
                          placeholder="vinculo url"
                          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={link.url}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].url =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mb-4">
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={() => handleAddLink(index)}
                    >
                      <BsLink45Deg className="mr-2" /> Agregar mas
                    </p>
                  </div>
                </>
              )}
              {index === courseContentData.length - 1 && (
                <div>
                  <p
                    className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                    onClick={(e: any) => newContentHandler(item)}
                  >
                    <AiOutlinePlusCircle className="mr-2" /> Agregar mas
                    contenido
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <br />
        <br />
        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Crear nueva seccion
        </div>
      </form>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => prevButton()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Anterior
        </button>
        <div
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all"
          onClick={() => handleOptions()}
        >
          Siguiente <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
