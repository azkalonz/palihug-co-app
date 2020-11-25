import React from "react";

const BottomNavContext = React.createContext();

export const getBottomNavContext = (setCartContext) => ({
  visible: false,
  notifications: {},
  addNotification: function (type, setCartContext) {
    let nextNotifications = { ...this.notifications };
    if (nextNotifications[type]) {
      nextNotifications[type] += 1;
    } else {
      nextNotifications[type] = 1;
    }
    console.log("a", this);
    setCartContext({
      ...this,
      visible: true,
      notifications: nextNotifications,
    });
  },
});

export default BottomNavContext;
