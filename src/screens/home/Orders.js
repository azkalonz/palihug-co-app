import { Box, List, ListItem, Tab, Tabs, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import OrderContext from "../../context/OrderContext";
import { slideRight } from "../../misc/transitions";
import moment from "moment";
import { history } from "../../App";

function Orders(props) {
  const bcontext = useContext(BottomNavContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const [tabValue, setTabValue] = useState(0);
  const [serviceId, setServiceId] = useState(0);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);
  const menu = useMemo(
    () => [
      { icon: "icon-coke-burger md" },
      { icon: "icon-gift md" },
      { icon: "icon-task md" },
      {
        icon: (
          <span className="icon-laundry md">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
          </span>
        ),
      },
      { icon: "icon-basket md" },
    ],
    []
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({
      ...bottomNavContext,
      visible: true,
    });
    setLoadingScreen({ ...loadingScreen, visible: true });
    (async () => {
      await orderContext.fetchOrders(setOrderContext);
      setLoadingScreen({ ...loadingScreen, visible: false });
    })();
  }, []);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRight}
      style={{ height: "100%" }}
    >
      <Box p={3}>
        <ScreenHeader title="Orders" />
      </Box>
      <Tabs
        value={serviceId}
        fullWidth
        onChange={(e, val) => setServiceId(val)}
        className="icon-tabs"
      >
        {menu.map((m, index) => (
          <Tab
            key={index}
            label={
              <AnimateOnTap>
                {typeof m.icon === "string" ? (
                  <span className={m.icon}></span>
                ) : (
                  m.icon
                )}
              </AnimateOnTap>
            }
          />
        ))}
      </Tabs>
      <Box m={3} marginTop={0} marginBottom={0}>
        <Tabs
          value={tabValue}
          fullWidth
          onChange={(e, val) => setTabValue(val)}
        >
          <Tab label={<AnimateOnTap>Pending</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>To Deliver</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>To Receive</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Cancelled</AnimateOnTap>} />
        </Tabs>
      </Box>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ paddingBottom: 50 }}
      >
        <Box height="100%">
          <Active status="pending" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Active status="processing" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Active status="finishing" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Active status="cancelled" serviceId={serviceId} />
        </Box>
      </SwipeableViews>
    </motion.div>
  );
}

function Active(props) {
  const { orderContext } = useContext(OrderContext);
  return (
    <Box p={3}>
      <List>
        {orderContext?.orders
          ?.filter((order) => order.status === props.status)
          .filter((order) => order.service_id === props.serviceId + 1)
          .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
          .map((order, index) => (
            <ListItem divider>
              <OrderCard {...order} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

function OrderCard(props) {
  const { status_text, order_date, order_id, total } = props;
  return (
    <AnimateOnTap
      whileTap={{ opacity: 0.5 }}
      style={{ width: "100%" }}
      onClick={() => history.push("/orders/" + order_id)}
    >
      <Box className="column-flex-100">
        <Box>
          <Typography>{moment(order_date).format("llll")}</Typography>
          <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
            Food Delivery
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Order no. {order_id}
          </Typography>
        </Box>
        <Box className="row-spaced center-align">
          <Typography color="primary" variant="body2">
            {status_text}
          </Typography>
          <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
            P {total}
          </Typography>
        </Box>
      </Box>
    </AnimateOnTap>
  );
}

export default Orders;
