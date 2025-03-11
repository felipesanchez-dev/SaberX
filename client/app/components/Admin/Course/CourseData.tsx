import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

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
  const handleInputChange = (
    index: number,
    value: string,
    type: "benefits" | "prerequisites"
  ) => {
    if (type === "benefits") {
      const updatedBenefits = [...benefits];
      updatedBenefits[index].title = value;
      setBenefits(updatedBenefits);
    } else {
      const updatedPrerequisites = [...prerequisites];
      updatedPrerequisites[index].title = value;
      setPrerequisites(updatedPrerequisites);
    }
  };

  const handleAddItem = (type: "benefits" | "prerequisites") => {
    if (type === "benefits") {
      setBenefits([...benefits, { title: "" }]);
    } else {
      setPrerequisites([...prerequisites, { title: "" }]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleNext = () => {
    if (
      benefits.some((b) => b.title === "") ||
      prerequisites.some((p) => p.title === "")
    ) {
      toast.error("Es necesario llenar todos los campos para avanzar");
      return;
    }
    setActive(active + 1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
      <div className="mb-8">
        <label className="block text-xl font-bold text-white mb-4">
          Beneficios del Curso
        </label>
        <AnimatePresence>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                type="text"
                placeholder="Ingrese un beneficio"
                className="w-full p-3 my-2 text-white bg-gray-800 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={benefit.title}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "benefits")
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAddItem("benefits")}
          className="flex items-center justify-center mt-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all shadow-lg"
        >
          <PlusCircle className="text-white w-6 h-6" />
        </motion.button>
      </div>

      <div>
        <label className="block text-xl font-bold text-white mb-4">
          Prerequisitos para el Curso
        </label>
        <AnimatePresence>
          {prerequisites.map((prerequisite, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                type="text"
                placeholder="Ingrese un prerequisito"
                className="w-full p-3 my-2 text-white bg-gray-800 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={prerequisite.title}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "prerequisites")
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAddItem("prerequisites")}
          className="flex items-center justify-center mt-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all shadow-lg"
        >
          <PlusCircle className="text-white w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevButton}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Anterior
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all"
        >
          Siguiente <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default CourseData;
