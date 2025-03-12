import React, { FC, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsPencil } from "react-icons/bs";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollasped = [...isCollapsed];
    updatedCollasped[index] = !updatedCollasped[index];
    setIsCollapsed(updatedCollasped);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  return (
    <div className="w-[80%] mx-auto mt-24 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <React.Fragment key={index}>
              <div
                className={`w-full p-5 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
                {showSectionInput && (
                  <div className="flex w-full items-center mb-3">
                    <input
                      type="text"
                      className={`text-lg font-semibold ${
                        item.videoSection === "Untitled Section"
                          ? "w-[200px]"
                          : "w-auto"
                      } bg-transparent outline-none text-gray-900 dark:text-white`}
                      value={item.videoSection}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoSection = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <BsPencil className="ml-2 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-white transition" />
                  </div>
                )}

                <div className="flex w-full items-center justify-between">
                  {isCollapsed[index] ? (
                    item.title && (
                      <p className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {item.title}
                      </p>
                    )
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

                {!isCollapsed[index] && (
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
                )}
                <br />
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Ingrese el video del curso (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="http://"
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
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none !h-min py-2"
                    value={item.description}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].description = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                </div>
                {item?.links.map((link: any, linkIndex: number) => (
                  <div className="mb-3 block">
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
                            : "cursor-not-allowed opacity-50"
                        }`}
                        onClick={() => {
                          linkIndex === 0
                            ? null
                            : handleRemoveLink(index, linkIndex);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder=""
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={link.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].links[linkIndex].title =
                          e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    {item?.links.map((link: any, linkIndex: number) => (
                      <div className="mb-3 block">
                        <div className="w-full flex items-center justify-center">
                          <label htmlFor="" className="">
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`text-xl mr-2 text-red-500 ${
                              linkIndex === 0
                                ? "cursor-pointer hover:text-red-700 transition"
                                : "cursor-not-allowed opacity-50"
                            }`}
                            onClick={() =>
                              linkIndex === 0
                                ? null
                                : handleRemoveLink(index, linkIndex)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </form>
    </div>
  );
};

export default CourseContent;
