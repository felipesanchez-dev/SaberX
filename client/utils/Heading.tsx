// "use client";
import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";

const Page: FC = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [title, setTitle] = useState("SaberX - La plataforma de aprendizaje accesible");

    useEffect(() => {
        document.title = title; // Actualiza el título en el cliente
    }, [title]);

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="SaberX es una plataforma de aprendizaje diseñada para hacer la educación accesible a todos." />
            <meta name="keywords" content="cursos online, educación en línea, aprender a programar, cursos de matemáticas, cálculo, inglés, formación digital, desarrollo profesional, aprendizaje autodidacta, plataforma educativa, educación accesible, cursos de tecnología, habilidades digitales, certificaciones online" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        </>
    );
};

export default Page;
