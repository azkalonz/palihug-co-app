import { ThemeProvider } from "@material-ui/core";
import { AnimatePresence } from "framer-motion";
import { createBrowserHistory } from "history";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Spinner from "./components/Spinner";
import BottomNavContext from "./context/BottomNavContext";
import LoadingScreenContext from "./context/LoadingScreenContext";
import GetStartedContext from "./context/GetStartedContext";
import ServicesContext from "./context/ServicesContext";
import UserContext from "./context/UserContext";
import theme from "./misc/theme";
import Routes from "./Routes";
import "./style.css";
import Api from "./utils/api";
import fetchData from "./utils/fetchData";
import { updatePastLocations } from "./utils/goBackOrPush";
import { createRoutingRule, routingRules } from "./utils/route-rules";

export const history = createBrowserHistory();
history.listen = (callback) => {
  callback(window.location.pathname);
};
createRoutingRule("IF_NOT_LOGGED_IN", true);
createRoutingRule("IF_LOGGED_IN", false);

function App() {
  const [loading, setLoading] = useState(true);
  const [getStartedContext, setGetStartedContext] = useState({
    page: 1,
  });
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [bottomNavContext, setBottomNavContext] = useState({ visible: false });
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
                // pushHistory("/");
                routingRules["IF_LOGGED_IN"].set(() => true);
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
                            <Switch location={location} key={location.pathname}>
                              {Routes.map((route, index) => (
                                <Route key={index} {...route} />
                              ))}
                            </Switch>
                          </AnimatePresence>
                        );
                      }}
                    />
                    {userContext?.user_status === "Verified" && (
                      <BottomNavigation />
                    )}
                  </BrowserRouter>
                )}
              </LoadingScreenContext.Provider>
              {loading && <Spinner image />}
            </ThemeProvider>
          </BottomNavContext.Provider>
        </ServicesContext.Provider>
      </GetStartedContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
