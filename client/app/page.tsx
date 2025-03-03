'use client'
import React, {FC, useState} from 'react'
import Heading from './utils/Heading';
import Header from '../components/Header';

interface Props {}

const Page: FC<Props> =(props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading 
      title="SaberX - La plataforma de aprendizaje accesible"
      description="SaberX es una plataforma de aprendizaje diseñada para hacer la educación accesible a todos."
      keywords="cursos online, educación en línea, aprender a programar, cursos de matemáticas, cálculo, inglés, formación digital, desarrollo profesional, aprendizaje autodidacta, plataforma educativa, educación accesible, cursos de tecnología, habilidades digitales, certificaciones online"
      />
      <Header 
      open={open}
      activeItem={activeItem}
      />
    </div>
  )
};

export default Page;