import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const NotificationContext = React.createContext();
export const getNotificationContext = (setNotificationContext) => ({
  notifications: [],
  newOrder: function (order, setNotificationContext) {
    setNotificationContext({ ...this, orders: [...this.orders, order] });
  },
  updateOrder: function (order, setNotificationContext) {
    let orders = [...this.orders];
    let orderIndex = orders.findIndex((q) => q.order_id === order.order_id);
    if (orderIndex >= 0) {
      orders[orderIndex] = order;
    }
    setNotificationContext({ ...this, orders });
  },
  fetchNotifications: async function (
    setNotificationContext,
    userContext = null
  ) {
    if (!userContext) {
      if (!this.isFetched) {
        await fetchData({
          send: async () => Api.get("/notifications?token=" + Api.getToken()),
          after: (data) => {
            if (data?.length)
              setNotificationContext({
                ...this,
                notifications: data,
                isFetched: true,
              });
          },
        });
      }
    } else if (userContext.user_type.name === "driver") {
      if (!this.isFetched) {
        await fetchData({
          send: async () => Api.get("/orders/driver?token=" + Api.getToken()),
          after: (data) => {
            if (data?.length)
              setNotificationContext({
                ...this,
                orders: data,
                isFetched: true,
              });
          },
        });
      }
    }
  },
});

export default NotificationContext;
