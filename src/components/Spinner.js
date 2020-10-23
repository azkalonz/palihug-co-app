import { Box, CircularProgress } from "@material-ui/core";
import React from "react";

function Spinner(props) {
  return (
    <Box className="spinner">
      <CircularProgress />
    </Box>
  );
}

export default Spinner;
