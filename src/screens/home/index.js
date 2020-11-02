import { Box, Container, Typography, useTheme } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Address from "../../components/Address";
import ServicesSlider from "../../components/ServicesSlider";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import ServicesContext from "../../context/ServicesContext";
import UserContext from "../../context/UserContext";
import { slideLeft } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export function Home(props) {
  const scontext = useContext(ServicesContext);
  const ucontext = useContext(UserContext);
  const { setLoadingScreen, loadingScreen } = useContext(LoadingScreenContext);
  const { setServicesContext } = scontext;
  const { userContext } = ucontext;
  useEffect(() => {
    fetchData({
      before: () => setLoadingScreen(true),
      send: async () => await Api.get("/services"),
      after: (data) => {
        setServicesContext(data);
        setLoadingScreen(false);
      },
    });
  }, []);
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={slideLeft}>
      <Container disableGutters={true}>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {userContext?.is_first_logon ? (
            <ServicesSlider />
          ) : (
            <HomePage {...props} />
          )}
        </Box>
      </Container>
    </motion.div>
  );
}
function HomePage(props) {
  const ucontext = useContext(UserContext);
  const scontext = useContext(ServicesContext);
  const bcontext = useContext(BottomNavContext);
  const theme = useTheme();
  const { userContext } = ucontext;
  const { servicesContext } = scontext;
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: true,
    });
  }, []);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignSelf="flex-start"
      justifySelf="flex-start"
      width="100%"
      p={3}
    >
      <Box>
        <Typography color="primary" variant="h5" style={{ fontWeight: 700 }}>
          Hi, {userContext.user_fname}{" "}
        </Typography>
        <Address />
      </Box>
      <AutoPlaySwipeableViews resistance>
        <Box p={3} display="flex" borderRadius={20} className="logo-container">
          <img
            src="/static/images/logo/horizontal.png"
            width="50%"
            alt="ESGO"
            style={{ filter: "grayscale(1) invert(1) brightness(2)" }}
          />
        </Box>
        <Box
          p={3}
          display="flex"
          borderRadius={20}
          className="logo-container"
          style={{ background: "#fff" }}
        >
          <img
            src="/static/images/logo/horizontal.png"
            width="50%"
            alt="ESGO"
          />
        </Box>
      </AutoPlaySwipeableViews>
      <Block title="Services">
        <Box className="services">
          {servicesContext?.map &&
            servicesContext?.map((service, index) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                key={index}
                style={{
                  backgroundColor: theme.palette.primary.pale,
                  padding: theme.spacing(1),
                  marginBottom: theme.spacing(1.5),
                }}
                onClick={() =>
                  props.history.push("/service/" + service.service_id)
                }
                className="service"
              >
                <img
                  src={service.service_icon_s}
                  alt={service.service_name}
                  width={40}
                />
                <Box>
                  <Typography color="primary" style={{ fontWeight: 700 }}>
                    {service.service_name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    style={{
                      fontSize: ".6em",
                    }}
                  >
                    {service.subname}
                  </Typography>
                </Box>
              </motion.div>
            ))}
        </Box>
      </Block>
    </Box>
  );
}

function Block(props) {
  return (
    <Box>
      <Typography
        color="primary"
        variant="h6"
        style={{ fontWeight: 700, marginBottom: 13 }}
      >
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
}
