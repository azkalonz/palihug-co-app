import { Box, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import ChatComponent from "../../components/ChatComponent";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import UserContext from "../../context/UserContext";
import { slideBottom } from "../../misc/transitions";

function Chat(props) {
  const order = props.location.state;
  const { setBottomNavContext, bottomNavContext } = useContext(
    BottomNavContext
  );
  const { delivery_info } = order || {};
  const { contact } = delivery_info || {};
  useEffect(() => {
    if (bottomNavContext.visible)
      setBottomNavContext({ ...bottomNavContext, visible: false });
  }, [bottomNavContext]);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideBottom}
      className="chat-container"
    >
      <Box p={2} paddingBottom={0}>
        <ScreenHeader
          title={
            <Box>
              <Typography
                color="primary"
                style={{ fontWeight: 700 }}
                variant="h5"
              >
                {contact?.name}
              </Typography>
              <Typography>{contact?.contact}</Typography>
            </Box>
          }
        />
      </Box>
      {order && <ChatComponent {...order} {...props} />}
    </motion.div>
  );
}

export default Chat;
