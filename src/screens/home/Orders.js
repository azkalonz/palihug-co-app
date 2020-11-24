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
import EmptyListMessage from "../../components/EmptyListMessage";

function Orders(props) {
  const bcontext = useContext(BottomNavContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const [tabValue, setTabValue] = useState(0);
  const [serviceId, setServiceId] = useState(0);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);
  const menu = useMemo(
    () => [
      { icon: "icon-coke-burger md", title: "E-Pagkain" },
      { icon: "icon-gift md", title: "E-Pasurprise" },
      { icon: "icon-task md", title: "E-Pasugo" },
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
        title: "E-Palaba",
      },
      { icon: "icon-basket md", title: "E-Pabili" },
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
                <span style={{ marginLeft: 7 }}>{m.title}</span>
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
          <Tab label={<AnimateOnTap>All</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Pending</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Processing</AnimateOnTap>} />
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
          <Order serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="pending" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="processing" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="finishing" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="cancelled" serviceId={serviceId} />
        </Box>
      </SwipeableViews>
    </motion.div>
  );
}

function Order(props) {
  const { orderContext } = useContext(OrderContext);
  const orders = useMemo(
    () =>
      orderContext?.orders
        ?.filter((order) =>
          props.status ? order.status === props.status : true
        )
        .filter((order) => order.service_id === props.serviceId + 1)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
    [orderContext, props.serviceId]
  );
  return (
    <Box p={3}>
      {!orders.length ? <EmptyListMessage>Empty</EmptyListMessage> : null}
      <List>
        {orders.map((order, index) => (
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
