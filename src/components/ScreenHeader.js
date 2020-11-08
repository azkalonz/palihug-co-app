import { Box, Icon, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { goBackOrPush } from "../utils/goBackOrPush";
import AnimateOnTap from "./AnimateOnTap";

function ScreenHeader(props) {
  const history = useHistory();
  return (
    <Box className="center-align">
      <AnimateOnTap>
        <IconButton
          disabled={!!props.disabled}
          className="back-button"
          onClick={() => {
            goBackOrPush(props.path || "/");
          }}
        >
          <Icon fontSize="large">navigate_before</Icon>
        </IconButton>
      </AnimateOnTap>
      {typeof props.title === "string" ? (
        <Typography color="primary" style={{ fontWeight: 700 }} variant="h5">
          {props.title}
        </Typography>
      ) : (
        props.title
      )}
    </Box>
  );
}

export default ScreenHeader;
