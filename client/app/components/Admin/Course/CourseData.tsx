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
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Es necesario llenar todos los campos para avanzar");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
      <div className="mb-8">
        <label className="block text-xl font-bold text-white mb-4">
          Beneficios del Curso
        </label>
        <AnimatePresence>
          {benefits.map((benefit: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                key={index}
                type="text"
                placeholder="Ingrese un beneficio"
                className="w-full p-3 my-2 text-white bg-gray-800 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={benefit.title}
                id="benefit"
                name="benefit"
                onChange={(e) => handleBenefitChange(index, e.target.value)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <PlusCircle
          style={{
            margin: "10px 0",
            cursor: "pointer",
            width: "30px",
          }}
          className="text-white w-6 h-6"
          onClick={handleAddBenefit}
        />
      </div>
      <div>
        <label className="block text-xl font-bold text-white mb-4">
          Prerequisitos para el Curso
        </label>
        <AnimatePresence>
          {prerequisites.map((prerequisites: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                key={index}
                type="text"
                name="prerequisites"
                id="prerequisites"
                placeholder="Ingrese un prerequisito"
                className="w-full p-3 my-2 text-white bg-gray-800 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={prerequisites.title}
                onChange={(e) =>
                  handlePrerequisitesChange(index, e.target.value)
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <PlusCircle
          style={{
            margin: "10px 0",
            cursor: "pointer",
            width: "30px",
          }}
          className="text-white w-6 h-6"
          onClick={handleAddPrerequisites}
        />
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevButton}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 " /> Anterior
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOptions}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all"
          >
            Siguiente <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CourseData;
