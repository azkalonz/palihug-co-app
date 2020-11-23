import { Box } from "@material-ui/core";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import VerifyOTP from "./components/VerifyOTP";
import NotFound from "./screens/404";
import { default as DriverProfile } from "./screens/driver/home/Profile";
import { GetStartedScreen } from "./screens/get-started";
import { Home } from "./screens/home";
import Address from "./screens/home/Address";
import AddressForm from "./screens/home/AddressForm";
import Notifications from "./screens/home/Notifications";
import Orders from "./screens/home/Orders";
import Profile from "./screens/home/Profile";
import { Login } from "./screens/login";
import Services from "./screens/services";
import Cart, { AddToCart } from "./screens/services/Cart";
import Checkout from "./screens/services/Checkout";
import Merchant from "./screens/services/Merchant";
import MerchantDetails from "./screens/services/MerchantDetails";
import { default as DriverOrders } from "./screens/driver/home/Orders";
import OrderDetails from "./screens/home/OrderDetails";
function createRoute(path, exact, component, props = {}) {
  return { path, exact, ...(component ? { component } : {}), ...props };
}
function withNavBottom(props, Screen, classes = "", padding = 10) {
  return (
    <Box
      height="100vh"
      overflow="auto"
      paddingBottom={padding}
      className={classes}
    >
      <Screen {...props} />
    </Box>
  );
}
export default [
  createRoute("/get-started", true, GetStartedScreen),
  createRoute("/verify-otp", true, VerifyOTP),
  createRoute("/register", true, RegisterForm),
  createRoute("/login", true, Login),
  createRoute("*", false, NotFound),
];

export const DriverRoutes = [
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, DriverOrders, "", 0),
  }),
  createRoute("/notifications", true, Notifications),
  createRoute("/profile", true, null, {
    render: (p) => withNavBottom(p, DriverProfile),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, OrderDetails, "column-flex-100"),
  }),
];

export const CustomerRoutes = [
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, Home),
  }),
  createRoute("/orders", true, null, {
    render: (p) => withNavBottom(p, Orders, "column-flex-100"),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, OrderDetails, "column-flex-100"),
  }),
  createRoute("/profile", true, null, {
    render: (p) => withNavBottom(p, Profile),
  }),
  createRoute("/profile/info", true, Orders),
  createRoute("/address", true, null, {
    render: (p) => withNavBottom(p, Address, "column-flex-100"),
  }),
  createRoute("/new-address", true, null, {
    render: (p) => withNavBottom(p, AddressForm, "column-flex-100"),
  }),
  createRoute("/service/:service_id", true, null, {
    render: (p) => withNavBottom(p, Services),
  }),
  createRoute("/add-to-cart", true, null, {
    render: (p) => withNavBottom(p, AddToCart),
  }),
  createRoute("/cart", true, null, {
    render: (p) => withNavBottom(p, Cart),
  }),
  createRoute("/checkout", true, Checkout),
  createRoute("/merchant/:merchant_id", true, null, {
    render: (p) => withNavBottom(p, Merchant, "", 0),
  }),
  createRoute("/merchant/:merchant_id/details", true, null, {
    render: (p) => withNavBottom(p, MerchantDetails),
  }),
  createRoute("/notifications", true, Notifications),
];

export const bottomNavRoutes = {
  driver: [
    {
      label: "Home",
      icon: "icon-task-alt md",
      value: "home",
      url: "/",
    },
    {
      label: "Notifications",
      icon: "icon-bell-alt md",
      value: "notifications",
      url: "/notifications",
    },
    {
      label: "Profile",
      icon: "icon-user-alt md",
      value: "profile",
      url: "/profile",
      relatedUrls: ["/info"],
    },
  ],
  customer: [
    {
      label: "Home",
      icon: "icon-home-alt md",
      value: "home",
      url: "/",
    },
    {
      label: "Orders",
      icon: "icon-task-alt md",
      value: "orders",
      url: "/orders",
    },
    {
      label: "Cart",
      icon: "icon-cart-alt md",
      iconStyle: {
        color: "#b9b8b8",
      },
      value: "cart",
      url: "/cart",
    },
    {
      label: "Notifications",
      icon: "icon-bell-alt md",
      value: "notifications",
      url: "/notifications",
    },
    {
      label: "Profile",
      icon: "icon-user-alt md",
      value: "profile",
      url: "/profile",
      relatedUrls: ["/info"],
    },
  ],
};
