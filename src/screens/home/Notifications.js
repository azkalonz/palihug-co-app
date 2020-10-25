import { motion } from "framer-motion";
import React, { useEffect, useContext } from "react";
import { slideRight } from "../../misc/transitions";
import BottomNavContext from "../../context/BottomNavContext";

function Notifications(props) {
  const bcontext = useContext(BottomNavContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      Notifications
    </motion.div>
  );
}

export default Notifications;
