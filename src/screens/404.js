import { Box, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";
import { fadeInOut } from "../misc/transitions";

function NotFound(props) {
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={fadeInOut}>
      <Box
        p={2}
        display="flex"
        height="100vh"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography color="primary" style={{ fontWeight: 700 }} variant="h4">
          Page Not Found
        </Typography>
        <Typography color="textSecondary">
          The page you're trying to access is not listed in our directory.
        </Typography>
      </Box>
    </motion.div>
  );
}

export default NotFound;
