import React, { useCallback, useContext, useEffect } from "react";
import BottomNavigation from "./user-globals/BottomNavigation";
import DialogComponent from "./user-globals/DialogComponent";
import OrderContext from "../context/OrderContext";
import UserContext from "../context/UserContext";
import socket from "../utils/socket";
function UserGlobals(props) {
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const { userContext } = useContext(UserContext);
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
    if (userContext.user_id) {
      socket.emit("user:online", userContext.user_id);
    }
  }, []);
  return (
    <React.Fragment>
      <BottomNavigation />
      <DialogComponent />
    </React.Fragment>
  );
}

export default UserGlobals;
