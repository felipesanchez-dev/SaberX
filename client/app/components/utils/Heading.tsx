"use client";
import React, { FC, useEffect } from "react";
import Head from "next/head";

interface HeadingProps {
  title: string;
}

const Heading: FC<HeadingProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="SaberX es una plataforma de aprendizaje diseñada para hacer la educación accesible a todos."
      />
      <meta
        name="keywords"
        content="cursos online, educación en línea, aprender a programar, cursos de matemáticas, cálculo, inglés, formación digital, desarrollo profesional, aprendizaje autodidacta, plataforma educativa, educación accesible, cursos de tecnología, habilidades digitales, certificaciones online"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="icon" type="image/png" href="/favicon.ico" />
    </Head>
  );
};

export default Heading;
