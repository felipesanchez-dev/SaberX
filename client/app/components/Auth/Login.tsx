"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";

type Props = {
  setRoute: (route: string) => void;
};

const shema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter a valid email address"),
  password: Yup.string().required("Please enter a valid password").min(6),
});

const Login: FC<Props> = ({ setRoute }) => {
  const [shadow, setShadow] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: shema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>
        Inicia sesión en <span className="text-primary">Saber X</span>
      </h1>
    </div>
  );
};

export default Login;
