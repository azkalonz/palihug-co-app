import { motion } from "framer-motion";
import React from "react";
import PinMap from "../../components/PinMap";
import { slideBottom } from "../../misc/transitions";

function Checkout(props) {
  return (
    <motion.div
      variants={slideBottom}
      initial="initial"
      exit="out"
      animate="in"
    >
      <PinMap />
    </motion.div>
  );
}

export default Checkout;
