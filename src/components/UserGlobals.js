import React, { useCallback, useContext, useEffect } from "react";
import BottomNavigation from "./user-globals/BottomNavigation";
import DialogComponent from "./user-globals/DialogComponent";
import OrderContext from "../context/OrderContext";
import UserContext from "../context/UserContext";
import socket from "../utils/socket";
import BottomNavContext from "../context/BottomNavContext";
import fetchData from "../utils/fetchData";
import Api from "../utils/api";
function UserGlobals(props) {
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const { userContext } = useContext(UserContext);
  const { bottomNavContext, setBottomNavContext } = useContext(
    BottomNavContext
  );
  const newOrder = useCallback(
    function (order) {
      orderContext.newOrder(order, setOrderContext);
    },
    [orderContext]
  );
  useEffect(() => {
    if (userContext?.user_type.name === "driver") {
      socket.off("order:new");
      socket.on("order:new", newOrder);
    } else if (userContext?.user_type.name === "customer") {
      socket.off("order:update");
      socket.on("order:update", function (order) {
        orderContext.updateOrder(order, setOrderContext);
      });
    }
  }, [orderContext]);
  useEffect(() => {
    if (bottomNavContext.addNotification) {
      socket.off("notifications:chat");
      socket.on("notifications:chat", function (notification) {
        bottomNavContext.addNotification("notifications", setBottomNavContext);
      });
    }
  }, [bottomNavContext]);
  useEffect(() => {
    if (userContext.user_id) {
      socket.emit("user:online", userContext.user_id);
    }
    fetchData({
      send: async () =>
        await Api.get("/notifications?count=true&token=" + Api.getToken()),
      after: (data) => {
        if (data) {
          setBottomNavContext({
            ...bottomNavContext,
            visible: true,
            notifications: data,
          });
        }
      },
    });
    return () => {
      socket.off("notifications:chat");
    };
  }, []);
  return (
    <React.Fragment>
      <BottomNavigation />
      <DialogComponent />
    </React.Fragment>
  );
}

export default UserGlobals;
