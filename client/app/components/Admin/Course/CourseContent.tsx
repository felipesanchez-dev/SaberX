import React, { FC, useState } from "react";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (data: any) => void;
  handleSubmit: any;
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

  const handleSumit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="w-[80%] m-auto mt-24 p3">
      <form onSubmit={handleSumit}></form>
    </div>
  );
};

export default CourseContent;
