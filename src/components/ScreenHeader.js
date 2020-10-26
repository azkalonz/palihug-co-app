import { Box, Icon, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { goBackOrPush } from "../utils/goBackOrPush.ts";
import AnimateOnTap from "./AnimateOnTap";

function ScreenHeader(props) {
  const history = useHistory();
  return (
    <Box className="center-align">
      <AnimateOnTap>
        <IconButton
          className="back-button"
          onClick={() => {
            goBackOrPush("/");
          }}
        >
          <Icon fontSize="large">navigate_before</Icon>
        </IconButton>
      </AnimateOnTap>
      <Typography color="primary" style={{ fontWeight: 700 }} variant="h5">
        {props.title}
      </Typography>
    </Box>
  );
}

export default ScreenHeader;
