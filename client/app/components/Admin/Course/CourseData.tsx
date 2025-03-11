import React, { FC } from "react";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };
  return (
    <div className="w-[80%] m-auto mt-24">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
        <label
          className="block text-lg font-semibold text-white mb-3"
          htmlFor="email"
        >
          ¿Cuáles son los beneficios para los estudiantes de este curso?
        </label>

        {benefits.map((benefit: any, index: number) => (
          <input
            key={index}
            type="text"
            name="Benefit"
            placeholder="Ingrese los beneficios del curso aquí"
            required
            className="w-full p-3 my-2 text-white bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseData;
