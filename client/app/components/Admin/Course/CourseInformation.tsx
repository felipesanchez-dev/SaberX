import React, { FC, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="w-[80%] mx-auto mt-24 p-6 bg-gray-900 shadow-xl rounded-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label htmlFor="name" className="text-lg font-semibold text-white">
          Nombre del curso
        </label>
        <input
          type="text"
          id="name"
          required
          value={courseInfo.name}
          onChange={(e: any) =>
            setCourseInfo({ ...courseInfo, name: e.target.value })
          }
          placeholder="Ingrese el nombre del curso"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-lg font-semibold text-white"
          >
            Descripción del curso
          </label>
          <textarea
            id="description"
            cols={30}
            rows={6}
            placeholder="Descipción del curso"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="w-full flex justify-between gap-4">
          <div className="w-[45%] flex flex-col gap-2">
            <label htmlFor="price" className="text-lg font-semibold text-white">
              Precio del curso (Opcional)
            </label>
            <input
              type="number"
              id="price"
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              placeholder="$0"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="w-[45%] flex flex-col gap-2">
            <label htmlFor="price" className="text-lg font-semibold text-white">
              Descuento del curso (Opcional)
            </label>
            <input
              type="number"
              id="price"
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              placeholder="$0"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="tags" className="text-lg font-semibold text-white">
            Etiquetas del curso
          </label>
          <input
            type="text"
            id="tags"
            required
            value={courseInfo.tags}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            placeholder="Ingrese las etiquetas del curso"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="w-full flex justify-between gap-4">
          {/* Nivel del curso */}
          <div className="w-[45%] flex flex-col gap-2">
            <label htmlFor="level" className="text-lg font-semibold text-white">
              Nivel del curso
            </label>
            <input
              type="text"
              id="level"
              value={courseInfo.level}
              required
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              placeholder="Fácil, Intermedio, Difícil, Profesional"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="w-[50%] flex flex-col gap-2">
            <label
              htmlFor="demoUrl"
              className="text-lg font-semibold text-white"
            >
              URL de demostración
            </label>
            <div className="relative">
              <input
                type="text"
                id="demoUrl"
                value={courseInfo.demoUrl}
                required
                onChange={(e: any) =>
                  setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                }
                placeholder="Ingrese la URL de demostración"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                🔗
              </span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[12vh] border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              dragging
                ? "bg-blue-500 border-blue-700 shadow-lg scale-105"
                : "bg-gray-900 border-gray-600 hover:border-blue-400 hover:bg-gray-800"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="Imagen seleccionada"
                className="max-h-[150px] w-auto object-cover rounded-lg shadow-md"
              />
            ) : (
              <span className="text-gray-400 dark:text-gray-300 text-sm font-medium">
                Arrastra o selecciona una imagen
              </span>
            )}
          </label>

          <div className="w-full flex items-center justify-end">
            <input
              type="submit"
              value="Siguiente"
              className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-white font-semibold text-center rounded-lg mt-6 cursor-pointer transition-all duration-300 hover:bg-[#2e857b] active:scale-95"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
