import { Box, Button, Icon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import "pure-react-carousel/dist/react-carousel.es.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import HorizontalScroll from "../../components/HorizontalScroll";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import { slideRightStill } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import Epabili from "./Epabili";
import Epagakain from "./Epagakain";

function Services(props) {
  const { service_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const [service, setService] = useState();
  const bcontext = useContext(BottomNavContext);
  const Service = useMemo(() => {
    const s = {
      pagkain: Epagakain,
      pabili: Epabili,
    };
    const Component = s[service?.slug];
    if (Component) {
      return Component;
    } else {
      return null;
    }
    return;
  }, [service]);
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: true,
    });
    fetchData({
      before: () => setLoadingScreen(false),
      send: async () => Api.get("/services/" + service_id),
      after: (data) => {
        setService(data);
        setLoadingScreen(false);
      },
    });
  }, []);
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={slideRightStill}
    >
      <Box p={3}>
        <ScreenHeader
          title={
            <Box className="center-all" justifyContent="flex-start">
              <Icon color="primary">room</Icon>
              <Button>Enter your address</Button>
            </Box>
          }
        />
      </Box>
      {typeof Service === "function" && (
        <Service {...props} service={service} />
      )}
      <HorizontalScroll>
        {typeof Service !== "function" &&
          new Array(5).fill(1).map((q, i) => (
            <Box key={i} width={150} height={200} m={1}>
              <Skeleton animation="wave" width="100%" height="100%" />
            </Box>
          ))}
      </HorizontalScroll>
    </motion.div>
  );
}

export default Services;
