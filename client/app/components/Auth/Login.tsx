"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Correo inválido")
    .required("Por favor, ingresa un correo válido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Por favor, ingresa una contraseña"),
});

type Props = {
  setRoute: (route: string) => void;
};

const Login: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      <h1 className="text-3xl font-extrabold text-center text-black dark:text-white mb-6">
        Bienvenido a <span className="text-primary">Saber X</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
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
            className={`w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary 
              bg-white text-black placeholder-gray-500 
              dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 shadow-md $ {
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
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Contraseña
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            className={`w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary 
              bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 shadow-md $ {
                errors.password && touched.password ? "border-red-500" : ""
              }`}
          />
          <button
            type="button"
            className="absolute right-4 top-10 text-gray-600 dark:text-gray-300 hover:text-primary"
            onClick={() => setShow(!show)}
            aria-label="Mostrar contraseña"
          >
            {show ? (
              <AiOutlineEye size={24} />
            ) : (
              <AiOutlineEyeInvisible size={24} />
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
            transition-all duration-300 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
        >
          <AiOutlineUserSwitch size={24} className="mr-2" />
          Iniciar Sesión
        </motion.button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        O inicia sesión con
      </div>
      <div className="flex items-center justify-center mt-3 gap-6">
        <FcGoogle
          size={36}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
        <AiFillGithub
          size={36}
          className="cursor-pointer hover:scale-110 transition-transform text-black dark:text-white"
        />
      </div>

      <div className="text-center pt-6 text-sm text-gray-600 dark:text-gray-300">
        ¿No tienes una cuenta Saber✘{" "}
        <span
          className="text-primary cursor-pointer hover:underline font-[900] text-blue-700"
          onClick={() => setRoute("Sign-Up")}
        >
          Crear cuenta 👈🏻
        </span>
      </div>
    </motion.div>
  );
};

export default Login;
