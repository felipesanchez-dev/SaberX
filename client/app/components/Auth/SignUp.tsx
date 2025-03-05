"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Ingrese su nombre"),
  email: Yup.string()
    .email("Correo inválido")
    .required("Por favor, ingresa un correo válido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Por favor, ingresa una contraseña"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      console.log(name, email, password);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-6">
        Crear cuenta en <span className="text-primary">Saber X</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.name && touched.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Ingresa tu email"
            className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.email && touched.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.password && touched.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <AiOutlineEye size={22} />
            ) : (
              <AiOutlineEyeInvisible size={22} />
            )}
          </button>
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex items-center justify-center py-3 text-lg font-semibold 
                    text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg 
                    transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
        >
          <AiOutlineUserAdd size={24} className="mr-2" />
          Crear cuenta
        </motion.button>
      </form>

      <h5 className="text-center pt-4 text-sm text-gray-600 dark:text-gray-300">
        Otras formas de Crear tu cuenta
      </h5>
      <div className="flex items-center justify-center my-3 gap-4">
        <FcGoogle
          size={30}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
        <AiFillGithub
          size={30}
          className="cursor-pointer hover:scale-110 transition-transform text-black dark:text-white"
        />
      </div>

      <h5 className="text-center pt-4 text-sm text-gray-600 dark:text-gray-300">
        ¿Ya tienes una cuenta en Saber✘{" "}
        <span
          className="text-primary cursor-pointer hover:underline font-[900] text-blue-700"
          onClick={() => setRoute("Login")}
        >
          Iniciar Sesión 👈🏻
        </span>
      </h5>
    </motion.div>
  );
};

export default SignUp;
