import { motion } from "framer-motion";
import "pure-react-carousel/dist/react-carousel.es.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Spinner from "../../components/Spinner";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import { slideRightStill } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import Epagakain from "./Epagakain";

function Services(props) {
  const { service_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const [service, setService] = useState();
  const bcontext = useContext(BottomNavContext);
  const Service = useMemo(() => {
    const s = {
      pagkain: Epagakain,
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
      before: () => setLoadingScreen(true),
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
      {typeof Service === "function" && (
        <Service {...props} service={service} />
      )}
    </motion.div>
  );
}

export default Services;
