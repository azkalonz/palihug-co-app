import { Box } from "@material-ui/core";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import VerifyOTP from "./components/VerifyOTP";
import NotFound from "./screens/404";
import { GetStartedScreen } from "./screens/get-started";
import { Home } from "./screens/home";
import History from "./screens/home/History";
import Notifications from "./screens/home/Notifications";
import Profile from "./screens/home/Profile";
import { Login } from "./screens/login";

function createRoute(path, exact, component, props = {}) {
  return { path, exact, ...(component ? { component } : {}), ...props };
}
function withNavBottom(props, Screen, classes = "") {
  return (
    <Box height="100vh" overflow="auto" paddingBottom={10} className={classes}>
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
  createRoute("/orders", true, History),
  createRoute("/service/:service_id?", true, History),
  createRoute("/notifications", true, Notifications),
  createRoute("*", false, NotFound),
];
