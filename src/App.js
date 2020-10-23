import { Box, CircularProgress, ThemeProvider } from "@material-ui/core";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import RegisterForm from "./components/RegisterForm";
import VerifyOTP from "./components/VerifyOTP";
import GetStartedContext from "./context/GetStartedContext";
import ServicesContext from "./context/ServicesContext";
import UserContext from "./context/UserContext";
import theme from "./misc/theme";
import { GetStartedScreen } from "./screens/get-started";
import { Home } from "./screens/home";
import Chat from "./screens/home/Chat";
import History from "./screens/home/History";
import Notifications from "./screens/home/Notifications";
import Profile from "./screens/home/Profile";
import { Login } from "./screens/login";
import "./style.css";
import Api from "./utils/api";
import NotFound from "./screens/404";
import fetchData from "./utils/fetchData";

function App() {
  // const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [getStartedContext, setGetStartedContext] = useState({
    page: 1,
  });
  const [servicesContext, setServicesContext] = useState({});
  const [userContext, setUserContext] = useState({});
  const pushHistory = (name) => {
    setLoading(false);
    if (window.location.pathname !== name) window.location = name;
  };
  useEffect(() => {
    let user = window.localStorage["user"];
    if (user) {
      try {
        user = JSON.parse(user);
        if (user?.user_token) {
          // if stored user variable has user_token
          let token =
            (user.user_token + "").length <= 9
              ? parseInt(user.user_token) / 1234
              : user.user_token;
          let body = { user_token: token + "" };
          fetchData({
            before: () => setLoading(true),
            send: async () => await Api.post("/login", { body }),
            after: (user) => {
              setUserContext(user);
              if (user?.user_status === "Verified") {
                // pushHistory("/");
                setLoading(false);
              } else if (user?.user_status === "Unverified") {
                pushHistory("/verify-otp");
              } else {
                pushHistory("/get-started");
              }
            },
          });
        } else {
          // if user has no session
          pushHistory("/get-started");
        }
      } catch (e) {
        // if fetchData fails
        pushHistory("/get-started");
      }
    } else {
      // if localStorage token is not assigned
      pushHistory("/get-started");
    }
  }, []);
  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <GetStartedContext.Provider
        value={{ getStartedContext, setGetStartedContext }}
      >
        <ServicesContext.Provider
          value={{ servicesContext, setServicesContext }}
        >
          <ThemeProvider theme={theme}>
            {!loading && (
              <BrowserRouter>
                <Route
                  render={({ location }) => (
                    <AnimatePresence exitBeforeEnter>
                      <Switch location={location} key={location.pathname}>
                        <Route
                          component={GetStartedScreen}
                          exact
                          path="/get-started"
                        />
                        <Route component={VerifyOTP} exact path="/verify-otp" />
                        <Route component={Home} exact path="/" />
                        <Route
                          component={RegisterForm}
                          exact
                          path="/register"
                        />
                        <Route component={Login} exact path="/login" />
                        <Route component={History} exact path="/history" />
                        <Route component={Chat} exact path="/chat" />
                        <Route component={Profile} exact path="/profile" />
                        <Route
                          component={Notifications}
                          exact
                          path="/notifications"
                        />
                        <Route component={NotFound} path="*" />
                      </Switch>
                    </AnimatePresence>
                  )}
                />
                {userContext?.user_status === "Verified" && (
                  <BottomNavigation />
                )}
              </BrowserRouter>
            )}

            {loading && (
              <Box
                height="100vh"
                width="100vw"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress />
              </Box>
            )}
          </ThemeProvider>
        </ServicesContext.Provider>
      </GetStartedContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
