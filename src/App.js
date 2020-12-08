import { Button, Icon, IconButton, ThemeProvider } from "@material-ui/core";
import { AnimatePresence } from "framer-motion";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Spinner from "./components/Spinner";
import UserGlobals from "./components/UserGlobals";
import BottomNavContext, {
  getBottomNavContext,
} from "./context/BottomNavContext";
import CartContext, { getCartContext } from "./context/CartContext";
import DialogContext from "./context/DialogContext";
import GetStartedContext from "./context/GetStartedContext";
import LoadingScreenContext from "./context/LoadingScreenContext";
import ServicesContext from "./context/ServicesContext";
import UserContext from "./context/UserContext";
import theme from "./misc/theme";
import Routes, { AdminRoutes, CustomerRoutes, DriverRoutes } from "./Routes";
import "./style.css";
import Api from "./utils/api";
import fetchData from "./utils/fetchData";
import { updatePastLocations } from "./utils/goBackOrPush";
import "mapbox-gl/dist/mapbox-gl.css";
import OrderContext, { getOrderContext } from "./context/OrderContext";
import NotificationContext, {
  getNotificationContext,
} from "./context/NotificationContext";
import socket from "./utils/socket";

export const history = createBrowserHistory();
history.listen = (callback) => {
  callback(window.location.pathname);
};
function OTPFormat(otp) {
  otp = otp + "";
  if (otp.length < 4) {
    for (let i = 0; i < 4 - otp.length; i++) {
      otp = "0" + otp;
    }
  }
  return otp;
}
function App() {
  const notistackRef = React.createRef();
  const [loading, setLoading] = useState(true);
  const [getStartedContext, setGetStartedContext] = useState({
    page: 1,
  });
  const [loadingScreen, setLoadingScreen] = useState({ visible: false });
  const [dialogContext, setDialogContext] = useState({ visible: false });
  const [bottomNavContext, setBottomNavContext] = useState({
    build: function () {
      setBottomNavContext(getBottomNavContext(setBottomNavContext));
    },
  });
  const [cartContext, setCartContext] = useState({
    build: function () {
      setCartContext(getCartContext(setCartContext));
    },
  });
  const [orderContext, setOrderContext] = useState({
    build: function () {
      setOrderContext(getOrderContext(setOrderContext));
    },
  });
  const [notificationContext, setNotificationContext] = useState({
    build: function () {
      setNotificationContext(getNotificationContext(setNotificationContext));
    },
  });
  const [servicesContext, setServicesContext] = useState({});
  const [userContext, setUserContext] = useState({});
  const pushHistory = (name) => {
    setLoading(false);
    if (window.location.pathname !== name) history.push(name);
  };
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  useEffect(() => {
    let user = window.localStorage["user"];
    if (user) {
      try {
        user = JSON.parse(user);
        if (user?.user_token) {
          let token =
            (user.user_token + "").length <= 9
              ? OTPFormat(parseInt(user.user_token) / 1234)
              : user.user_token;
          let body = { user_token: token + "" };
          fetchData({
            before: () => setLoading(true),
            send: async () => await Api.post("/login", { body }),
            after: (user) => {
              setUserContext(user);
              if (user?.user_status === "Verified") {
                setLoading(false);
              } else if (user?.user_status === "Unverified") {
                pushHistory("/verify-otp");
              } else {
                // if user status is neither verified/unverified
                pushHistory("/get-started");
              }
            },
          });
        } else {
          // invalid user token or no user token found
          pushHistory("/login");
        }
      } catch (e) {
        // error from API
        pushHistory("/get-started");
      }
    } else {
      // if no user in localStorage
      pushHistory("/get-started");
    }
  }, []);
  useEffect(() => {
    history.listen(function (location) {
      updatePastLocations(location);
    });
  }, [window.location.pathname]);
  useEffect(() => {
    if (cartContext.build) {
      // build() replaces the state of cartContext to the returned object (removes build() on the process)
      cartContext.build();
    }
    if (orderContext.build) {
      orderContext.build();
    }
    if (bottomNavContext.build) {
      bottomNavContext.build();
    }
    if (notificationContext.build) {
      notificationContext.build();
    }
  }, [
    cartContext.build,
    orderContext.build,
    bottomNavContext.build,
    notificationContext.build,
  ]);
  useEffect(() => {
    if (
      userContext?.user_token &&
      cartContext?.products &&
      !cartContext?.isFetched
    ) {
      // only fetch cart items once base on the condition inside if statement to minimize api calls
      fetchData({
        send: async () => Api.get("/cart?token=" + userContext?.user_token),
        after: (data) => {
          try {
            // meta is a json string of the cartContext from the Api
            let meta = JSON.parse(data?.meta);
            if (meta) {
              // if there is a meta available, replace the current cartContext and set fetched to true
              setCartContext({ ...cartContext, ...meta, isFetched: true });
            }
          } catch (e) {}
        },
      });
    }
  }, [userContext?.user_token, cartContext.products]);
  useEffect(() => {
    if (userContext.user_id) socket.emit("user:online", userContext.user_id);
  }, [userContext.user_id]);
  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <CartContext.Provider value={{ cartContext, setCartContext }}>
        <OrderContext.Provider value={{ orderContext, setOrderContext }}>
          <NotificationContext.Provider
            value={{ notificationContext, setNotificationContext }}
          >
            <GetStartedContext.Provider
              value={{ getStartedContext, setGetStartedContext }}
            >
              <ServicesContext.Provider
                value={{ servicesContext, setServicesContext }}
              >
                <SnackbarProvider
                  ref={notistackRef}
                  maxSnack={3}
                  preventDuplicate
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  action={(key) => (
                    <IconButton onClick={onClickDismiss(key)}>
                      <Icon>close</Icon>
                    </IconButton>
                  )}
                >
                  <DialogContext.Provider
                    value={{ dialogContext, setDialogContext }}
                  >
                    <BottomNavContext.Provider
                      value={{ bottomNavContext, setBottomNavContext }}
                    >
                      <ThemeProvider theme={theme}>
                        <LoadingScreenContext.Provider
                          value={{ loadingScreen, setLoadingScreen }}
                        >
                          {!loading && (
                            <BrowserRouter history={history}>
                              {loadingScreen.visible && (
                                <Spinner variant={loadingScreen.variant} />
                              )}
                              <Route
                                render={(r) => {
                                  const { location } = r;
                                  const h = r.history;
                                  history.push = h.push;
                                  history.goBack = h.goBack;
                                  return (
                                    <AnimatePresence exitBeforeEnter>
                                      <Switch
                                        location={location}
                                        key={location.pathname}
                                      >
                                        {userContext?.user_type?.name ===
                                          "driver" &&
                                          DriverRoutes.map((route, index) => (
                                            <Route key={index} {...route} />
                                          ))}
                                        {userContext?.user_type?.name ===
                                          "admin" &&
                                          AdminRoutes.map((route, index) => (
                                            <Route key={index} {...route} />
                                          ))}
                                        {userContext?.user_type?.name ===
                                          "customer" &&
                                          CustomerRoutes.map((route, index) => (
                                            <Route key={index} {...route} />
                                          ))}
                                        {Routes.map((route, index) => (
                                          <Route key={index} {...route} />
                                        ))}
                                      </Switch>
                                    </AnimatePresence>
                                  );
                                }}
                              />
                              {userContext?.user_status === "Verified" && (
                                <UserGlobals />
                              )}
                            </BrowserRouter>
                          )}
                        </LoadingScreenContext.Provider>
                        {loading && <Spinner image />}
                      </ThemeProvider>
                    </BottomNavContext.Provider>
                  </DialogContext.Provider>
                </SnackbarProvider>
              </ServicesContext.Provider>
            </GetStartedContext.Provider>
          </NotificationContext.Provider>
        </OrderContext.Provider>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
