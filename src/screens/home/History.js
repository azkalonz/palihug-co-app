import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { slideRight } from "../../misc/transitions";
import BottomNavContext from "../../context/BottomNavContext";

function History(props) {
  const bcontext = useContext(BottomNavContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      History
    </motion.div>
  );
}

export default History;
