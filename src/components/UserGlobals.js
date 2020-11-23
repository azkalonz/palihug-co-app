import React, { useCallback, useContext, useEffect } from "react";
import BottomNavigation from "./user-globals/BottomNavigation";
import DialogComponent from "./user-globals/DialogComponent";
import Socket from "../utils/socket";
import OrderContext from "../context/OrderContext";
import UserContext from "../context/UserContext";
function UserGlobals(props) {
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const { userContext } = useContext(UserContext);
  const newOrder = useCallback(
    function (order) {
      console.log("new order", order);
      orderContext.newOrder(order, setOrderContext);
      console.log(orderContext.orders.length);
    },
    [orderContext]
  );
  useEffect(() => {
    if (userContext?.user_type.name === "driver") {
      Socket.off("new order");
      Socket.on("new order", newOrder);
    }
  }, [orderContext]);
  return (
    <React.Fragment>
      <BottomNavigation />
      <DialogComponent />
    </React.Fragment>
  );
}

export default UserGlobals;
