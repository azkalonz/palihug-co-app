import { motion } from "framer-motion";
import React from "react";
import { slideRight } from "../../misc/transitions";

function History(props) {
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      History
    </motion.div>
  );
}

export default History;
