import React, { ReactNode } from "react";
// import { NextSeo } from 'next-seo'
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: 100,
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 0,
    y: -100,
    transition: {
      duration: 0.5,
    },
  },
};

const AnimatedLayout = ({
  children,
  title,
  description,
}: Props): JSX.Element => (
  <div>
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.main>
  </div>
);

export default AnimatedLayout;
