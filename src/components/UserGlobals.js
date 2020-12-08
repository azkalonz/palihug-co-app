import React, { useCallback, useContext, useEffect } from "react";
import BottomNavigation from "./user-globals/BottomNavigation";
import DialogComponent from "./user-globals/DialogComponent";
import OrderContext from "../context/OrderContext";
import UserContext from "../context/UserContext";
import socket from "../utils/socket";
import BottomNavContext from "../context/BottomNavContext";
import fetchData from "../utils/fetchData";
import Api from "../utils/api";
import NotificationContext from "../context/NotificationContext";
import Layout from "../screens/admin/Layout";
function UserGlobals(props) {
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const { notificationContext, setNotificationContext } = useContext(
    NotificationContext
  );
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
    socket.off("notifications:new");
    socket.on("notifications:new", function (notification) {
      notificationContext.newNotification(notification, setNotificationContext);
    });
  }, [orderContext, notificationContext]);
  useEffect(() => {
    if (!bottomNavContext.build) {
      socket.off("notifications:chat");
      socket.off("notifications:chat:remove");
      socket.on("notifications:chat", function (notification) {
        bottomNavContext.add("notifications", setBottomNavContext);
      });
      socket.on("notifications:chat:remove", function (notifications) {
        console.log(notifications, "aaa");
        if (notifications?.length) {
          bottomNavContext.remove(
            "notifications",
            notifications.length,
            setBottomNavContext
          );
          notificationContext.updateNotification(
            notifications,
            setBottomNavContext
          );
        }
      });
    }
  }, [bottomNavContext]);
  useEffect(() => {
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
