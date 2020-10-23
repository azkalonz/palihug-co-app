import { motion } from "framer-motion";
import React from "react";
import { slideRight } from "../../misc/transitions";

function Notifications(props) {
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      Notifications
    </motion.div>
  );
}

export default Notifications;
