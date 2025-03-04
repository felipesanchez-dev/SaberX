"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Routes/Hero";

const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  return (
    <>
      <Heading />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Hero />
    </>
  );
};

export default Page;
