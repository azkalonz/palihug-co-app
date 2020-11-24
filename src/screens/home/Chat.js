import { Box } from "@material-ui/core";
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
        <ScreenHeader title="Chat" />
      </Box>
      {order && <ChatComponent {...order} />}
    </motion.div>
  );
}

export default Chat;
