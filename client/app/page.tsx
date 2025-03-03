'use client'
import React, {FC} from 'react'
import Heading from './utils/Heading';

interface Props {}

const Page: FC<Props> =(props) => {
  return (
    <div>
      <Heading 
      title="SaberX - La plataforma de aprendizaje accesible"
      description="SaberX es una plataforma de aprendizaje diseñada para hacer la educación accesible a todos."
      keywords="cursos online, educación en línea, aprender a programar, cursos de matemáticas, cálculo, inglés, formación digital, desarrollo profesional, aprendizaje autodidacta, plataforma educativa, educación accesible, cursos de tecnología, habilidades digitales, certificaciones online"
      />
    </div>
  )
};

export default Page