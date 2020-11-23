import { Box, List, ListItem, Tab, Tabs, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import { slideRight } from "../../misc/transitions";

function Orders(props) {
  const bcontext = useContext(BottomNavContext);
  const [tabValue, setTabValue] = useState(0);
  const [serviceId, setServiceId] = useState(0);
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
    setBottomNavContext({ ...bottomNavContext, visible: true });
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
      <Tabs
        centered
        value={tabValue}
        fullWidth
        onChange={(e, val) => setTabValue(val)}
      >
        <Tab label={<AnimateOnTap>Pending</AnimateOnTap>} />
        <Tab label={<AnimateOnTap>To Deliver</AnimateOnTap>} />
        <Tab label={<AnimateOnTap>To Receive</AnimateOnTap>} />
      </Tabs>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ height: "100%" }}
      >
        <Box height="100%">
          <InActive />
        </Box>
        <Box height="100%">
          <Active />
        </Box>
        <Box height="100%">
          <Active />
        </Box>
      </SwipeableViews>
    </motion.div>
  );
}

function Active() {
  return (
    <Box p={3}>
      <List>
        <ListItem divider>
          <OrderCard />
        </ListItem>
        <ListItem divider>
          <OrderCard />
        </ListItem>
      </List>
    </Box>
  );
}
function InActive() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <React.Fragment>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ height: "100%" }}
      >
        <Box height="100%" p={3}>
          <List>
            <ListItem divider>
              <OrderCard />
            </ListItem>
            <ListItem divider>
              <OrderCard />
            </ListItem>
          </List>
        </Box>
        <Box height="100%" p={3}>
          <List>
            <ListItem divider>
              <OrderCard />
            </ListItem>
            <ListItem divider>
              <OrderCard />
            </ListItem>
          </List>
        </Box>
      </SwipeableViews>
    </React.Fragment>
  );
}

function OrderCard() {
  return (
    <AnimateOnTap whileTap={{ opacity: 0.5 }} style={{ width: "100%" }}>
      <Box className="column-flex-100">
        <Box>
          <Typography>Fri, 25 Sep. 2020 5:00 AM</Typography>
          <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
            Food Delivery
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Order no. 9536481
          </Typography>
        </Box>
        <Box className="row-spaced center-align">
          <Typography color="primary" variant="body2">
            Preparing your food
          </Typography>
          <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
            P 500.00
          </Typography>
        </Box>
      </Box>
    </AnimateOnTap>
  );
}

export default Orders;
