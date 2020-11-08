import { Box, Container, Typography, useTheme } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import Services from "../services";

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
  const [page, setPage] = useState(1);
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
    >
      <Block>
        <Typography color="primary" variant="h5" style={{ fontWeight: 700 }}>
          Hi, {userContext?.user_fname}{" "}
        </Typography>
        <Address />
      </Block>
      <br />
      <Box position="relative">
        <AutoPlaySwipeableViews
          index={page - 1}
          resistance
          onChangeIndex={(index) => setPage(index + 1)}
        >
          <Box display="flex">
            <img
              src="/static/images/carousel/jollibee.jpg"
              width="100%"
              alt="Jollibee"
            />
          </Box>
          <Box display="flex">
            <img
              src="/static/images/carousel/mcdo.jpg"
              width="100%"
              alt="McDonalds"
            />
          </Box>
          <Box display="flex">
            <img
              src="/static/images/carousel/kfc.jpg"
              width="100%"
              alt="McDonalds"
            />
          </Box>
          <Box display="flex">
            <img
              src="/static/images/carousel/jollibee.jpg"
              width="100%"
              alt="Jollibee"
            />
          </Box>
          <Box display="flex">
            <img
              src="/static/images/carousel/mcdo.jpg"
              width="100%"
              alt="McDonalds"
            />
          </Box>
          <Box display="flex">
            <img
              src="/static/images/carousel/kfc.jpg"
              width="100%"
              alt="McDonalds"
            />
          </Box>
        </AutoPlaySwipeableViews>
        <CarouselPagination
          page={page}
          totalPages={6}
          onClick={(index) => {
            setPage(index);
          }}
        />
      </Box>
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
      <Services
        service={1}
        hidden={{ blocks: { restaurants: true } }}
        blocks={{
          params: {
            products: {
              order: "asc",
            },
          },
        }}
      />
      <br />
      <br />
      <Services
        service={1}
        hidden={{ blocks: { products: true } }}
        blocks={{
          params: {
            products: {
              order: "asc",
            },
          },
        }}
      />
    </Box>
  );
}

function CarouselPagination(props) {
  const step = 14;
  const { totalPages, page } = props;
  const translate = useMemo(() => {
    let t = 2;
    if (page !== 1) {
      t = step * (page - 1);
      t += 2;
    }
    return `translateX(${t}px)`;
  }, [page]);
  return (
    <div className="carousel-pagination">
      <ul>
        {new Array(totalPages).fill("").map((a, i) => (
          <li
            onClick={() => props.onClick(i + 1)}
            key={i}
            className={"p-button " + (i === page - 1 ? "active" : "")}
          ></li>
        ))}
        <li className="disc">
          <div style={{ transform: translate }}></div>
        </li>
      </ul>
    </div>
  );
}

export function Block(props) {
  const theme = useTheme();
  return (
    <Box
      overflow="hidden"
      p={props.p !== undefined ? props.p : 3}
      paddingBottom={0}
    >
      {props.p !== undefined ? (
        <Typography
          color="primary"
          variant="h6"
          style={{
            fontWeight: 700,
            marginBottom: 13,
            padding: theme.spacing(3),
            ...(props.titleStyle ? props.titleStyle : {}),
          }}
        >
          {props.title}
        </Typography>
      ) : (
        <Typography
          color="primary"
          variant="h6"
          style={{ fontWeight: 700, marginBottom: 13 }}
        >
          {props.title}
        </Typography>
      )}
      {props.children}
    </Box>
  );
}
