"use client";
import React, { FC, useState, useEffect } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../components/utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  const [pageTitle, setPageTitle] = useState("Cargando perfil...");

  useEffect(() => {
    if (user?.name) {
      setPageTitle(`${user.name} - SaberX`);
    }
  }, [user]);

  return (
    <>
      <Protected>
        <Heading title={pageTitle} />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile />
      </Protected>
    </>
  );
};

export default Page;
