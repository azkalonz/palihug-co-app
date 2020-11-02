import { Box } from "@material-ui/core";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import VerifyOTP from "./components/VerifyOTP";
import NotFound from "./screens/404";
import { GetStartedScreen } from "./screens/get-started";
import { Home } from "./screens/home";
import Address from "./screens/home/Address";
import History from "./screens/home/History";
import Notifications from "./screens/home/Notifications";
import Profile from "./screens/home/Profile";
import { Login } from "./screens/login";
import Services from "./screens/services";
import Merchant from "./screens/services/Merchant";

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
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, Home),
  }),
  createRoute("/get-started", true, GetStartedScreen),
  createRoute("/verify-otp", true, VerifyOTP),
  createRoute("/register", true, RegisterForm),
  createRoute("/login", true, Login),
  createRoute("/history", true, null, {
    render: (p) => withNavBottom(p, History, "column-flex-100"),
  }),
  createRoute("/profile", true, null, {
    render: (p) => withNavBottom(p, Profile),
  }),
  createRoute("/profile/info", true, History),
  createRoute("/address", true, null, {
    render: (p) => withNavBottom(p, Address, "column-flex-100"),
  }),
  createRoute("/orders", true, History),
  createRoute("/service/:service_id", true, null, {
    render: (p) => withNavBottom(p, Services),
  }),
  createRoute("/merchant/:merchant_id", true, null, {
    render: (p) => withNavBottom(p, Merchant, "", 0),
  }),
  createRoute("/notifications", true, Notifications),
  createRoute("*", false, NotFound),
];
