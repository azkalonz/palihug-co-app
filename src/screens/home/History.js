import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { slideRight } from "../../misc/transitions";
import BottomNavContext from "../../context/BottomNavContext";
import ScreenHeader from "../../components/ScreenHeader";
import { Box } from "@material-ui/core";

function History(props) {
  const bcontext = useContext(BottomNavContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="History" />
      </Box>
    </motion.div>
  );
}

export default History;
