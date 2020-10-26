import { motion } from "framer-motion";
import React, { useEffect, useContext } from "react";
import { slideRight } from "../../misc/transitions";
import BottomNavContext from "../../context/BottomNavContext";
import ScreenHeader from "../../components/ScreenHeader";
import { Box } from "@material-ui/core";

function Notifications(props) {
  const bcontext = useContext(BottomNavContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="Notifications" />
      </Box>
    </motion.div>
  );
}

export default Notifications;
