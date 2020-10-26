import { ThemeProvider } from "@material-ui/core";
import { AnimatePresence } from "framer-motion";
import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import { Route, Router, Switch } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Spinner from "./components/Spinner";
import BottomNavContext from "./context/BottomNavContext";
import GetStartedContext from "./context/GetStartedContext";
import ServicesContext from "./context/ServicesContext";
import UserContext from "./context/UserContext";
import theme from "./misc/theme";
import Routes from "./Routes";
import "./style.css";
import Api from "./utils/api";
import fetchData from "./utils/fetchData";
import { updatePastLocations } from "./utils/goBackOrPush.ts";

export const history = createBrowserHistory();
history.listen(updatePastLocations);

function App() {
  // const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [getStartedContext, setGetStartedContext] = useState({
    page: 1,
  });
  const [bottomNavContext, setBottomNavContext] = useState({ visible: false });
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
          <BottomNavContext.Provider
            value={{ bottomNavContext, setBottomNavContext }}
          >
            <ThemeProvider theme={theme}>
              {!loading && (
                <Router history={history}>
                  <Route
                    render={({ location }) => (
                      <AnimatePresence exitBeforeEnter>
                        <Switch location={location} key={location.pathname}>
                          {Routes.map((route, index) => (
                            <Route key={index} {...route} />
                          ))}
                        </Switch>
                      </AnimatePresence>
                    )}
                  />
                  {userContext?.user_status === "Verified" && (
                    <BottomNavigation />
                  )}
                </Router>
              )}

              {loading && <Spinner image />}
            </ThemeProvider>
          </BottomNavContext.Provider>
        </ServicesContext.Provider>
      </GetStartedContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
