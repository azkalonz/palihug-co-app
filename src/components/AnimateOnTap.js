import { motion } from "framer-motion";
import React from "react";

function AnimateOnTap(props) {
  return <motion.div whileTap={{ scale: 0.9 }}>{props.children}</motion.div>;
}

export default AnimateOnTap;
