import { motion } from "framer-motion";
import React from "react";
import { slideRight } from "../../misc/transitions";

function Chat(props) {
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      Chat
    </motion.div>
  );
}

export default Chat;
