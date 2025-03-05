"use client";
import React, { useState } from "react";
import Heading from "./components/utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Routes/Hero";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <>
      <Heading />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
    </>
  );
};

export default Page;
