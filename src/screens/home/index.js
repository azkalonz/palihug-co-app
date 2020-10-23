import {
  Box,
  Button,
  Container,
  Icon,
  Typography,
  useTheme,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ServicesSlider from "../../components/ServicesSlider";
import Spinner from "../../components/Spinner";
import ServicesContext from "../../context/ServicesContext";
import UserContext from "../../context/UserContext";
import { slideLeft } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

export function Home(props) {
  const scontext = useContext(ServicesContext);
  const ucontext = useContext(UserContext);
  const { setServicesContext } = scontext;
  const [loading, setLoading] = useState(true);
  const { userContext } = ucontext;
  useEffect(() => {
    fetchData({
      send: async () => await Api.get("/services"),
      after: (data) => {
        setServicesContext(data);
        setLoading(false);
      },
    });
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <motion.div initial="initial" animate="in" exit="out" variants={slideLeft}>
      <Container disableGutters={true}>
        <Box
          height="100vh"
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
  const theme = useTheme();
  const { userContext } = ucontext;
  const { servicesContext } = scontext;
  const logout = useCallback(() => {
    window.localStorage.clear();
    window.location = "/";
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
          <Button
            onClick={logout}
            variant="outlined"
            color="primary"
            style={{ float: "right" }}
          >
            Logout
          </Button>
        </Typography>
        <Box className="center-all" justifyContent="flex-start">
          <Icon color="primary">room</Icon>
          <Button>Enter your address</Button>
        </Box>
      </Box>
      <Block title="Services">
        <Box className="services">
          {servicesContext?.map((service, index) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              key={index}
              style={{
                backgroundColor: theme.palette.primary.pale,
                padding: theme.spacing(1),
                marginBottom: theme.spacing(1.5),
              }}
              onClick={() => props.history.push("test")}
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
