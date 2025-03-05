"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLogin,
} from "react-icons/ai";
import { motion } from "framer-motion";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Correo inválido")
    .required("Por favor, ingresa un correo válido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Por favor, ingresa una contraseña"),
});

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
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-6">
        Inicia sesión en <span className="text-primary">Saber X</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Email */}
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
            className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.email && touched.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Input Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
            className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.password && touched.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-600 dark:text-gray-300"
            onClick={() => setShow(!show)}
            aria-label="Mostrar contraseña"
          >
            {show ? (
              <AiOutlineEye size={22} />
            ) : (
              <AiOutlineEyeInvisible size={22} />
            )}
          </button>
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex items-center justify-center py-3 px-6 text-lg font-semibold text-white bg-primary rounded-lg shadow-lg transition-all duration-300 hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <AiOutlineLogin
            size={20}
            className="mr-2 text-black dark:text-white"
          />
          <span className="text-black dark:text-white">Iniciar Sesion</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;
