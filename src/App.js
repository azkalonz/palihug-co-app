import { ThemeProvider } from "@material-ui/core";
import { AnimatePresence } from "framer-motion";
import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Spinner from "./components/Spinner";
import UserGlobals from "./components/UserGlobals";
import BottomNavContext from "./context/BottomNavContext";
import CartContext from "./context/CartContext";
import GetStartedContext from "./context/GetStartedContext";
import LoadingScreenContext from "./context/LoadingScreenContext";
import ServicesContext from "./context/ServicesContext";
import UserContext from "./context/UserContext";
import theme from "./misc/theme";
import Routes from "./Routes";
import "./style.css";
import Api from "./utils/api";
import fetchData from "./utils/fetchData";
import { updatePastLocations } from "./utils/goBackOrPush";

export const history = createBrowserHistory();
history.listen = (callback) => {
  callback(window.location.pathname);
};

function App() {
  const [loading, setLoading] = useState(true);
  const [getStartedContext, setGetStartedContext] = useState({
    page: 1,
  });
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [cartContext, setCartContext] = useState({ products: [], total: 0 });
  const [bottomNavContext, setBottomNavContext] = useState({
    visible: false,
    notifications: {},
  });
  const [servicesContext, setServicesContext] = useState({});
  const [userContext, setUserContext] = useState({});
  const pushHistory = (name) => {
    setLoading(false);
    if (window.location.pathname !== name) history.push(name);
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
                setLoading(false);
              } else if (user?.user_status === "Unverified") {
                pushHistory("/verify-otp");
              } else {
                pushHistory("/get-started");
              }
            },
          });
        }
      } catch (e) {
        pushHistory("/get-started");
      }
    } else {
      pushHistory("/get-started");
    }
  }, []);
  useEffect(() => {
    history.listen(function (location) {
      updatePastLocations(location);
    });
  }, [window.location.pathname]);
  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <CartContext.Provider value={{ cartContext, setCartContext }}>
        <GetStartedContext.Provider
          value={{ getStartedContext, setGetStartedContext }}
        >
          <ServicesContext.Provider
            value={{ servicesContext, setServicesContext }}
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
                      {loadingScreen && <Spinner />}
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
          </ServicesContext.Provider>
        </GetStartedContext.Provider>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
