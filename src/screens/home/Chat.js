import { Box, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import ChatComponent from "../../components/ChatComponent";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import UserContext from "../../context/UserContext";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

function Chat(props) {
  const [order, setOrder] = useState(props.location.state);
  const { order_id } = props.match.params;
  const { setLoadingScreen, loadingScreen } = useContext(LoadingScreenContext);
  const { setBottomNavContext, bottomNavContext } = useContext(
    BottomNavContext
  );
  const { delivery_info } = order || {};
  const { contact } = delivery_info || {};
  useEffect(() => {
    if (bottomNavContext.visible)
      setBottomNavContext({ ...bottomNavContext, visible: false });
  }, [bottomNavContext]);
  useEffect(() => {
    if (order_id !== undefined && !props.location.state) {
      setLoadingScreen({
        ...loadingScreen,
        visible: true,
        variant: null,
      });
      fetchData({
        send: async () =>
          await Api.get("/order/" + order_id + "?token=" + Api.getToken()),
        after: (data) => {
          if (data) {
            data.delivery_info = JSON.parse(data.delivery_info);
            setOrder(data);
            setLoadingScreen({ ...loadingScreen, visible: false });
          } else {
            window.location = "/";
          }
        },
      });
    }
  }, []);
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
