import { Box, CircularProgress } from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";

function Spinner(props) {
  return (
    <Box className="spinner">
      {props.image ? (
        <motion.div
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
          }}
          style={{ width: 100, pointerEvents: "none", opacity: 0.7 }}
        >
          <img
            src="/static/images/logo/vertical.png"
            width="100%"
            alt="Loading"
          />
        </motion.div>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}

export default Spinner;
