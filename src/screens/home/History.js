import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { slideRight } from "../../misc/transitions";
import BottomNavContext from "../../context/BottomNavContext";
import ScreenHeader from "../../components/ScreenHeader";
import { Box, List, ListItem, Tab, Tabs, Typography } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function History(props) {
  const bcontext = useContext(BottomNavContext);
  const [tabValue, setTabValue] = useState(0);
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
        <ScreenHeader title="History" />
        <Tabs
          centered
          value={tabValue}
          fullWidth
          onChange={(e, val) => setTabValue(val)}
        >
          <Tab label={<AnimateOnTap>Active</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>History</AnimateOnTap>} />
        </Tabs>
      </Box>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ height: "100%" }}
      >
        <Box height="100%">
          <Active />
        </Box>
        <Box height="100%">
          <InActive />
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
  return (
    <Box p={3}>
      <List>
        <ListItem divider>
          <OrderCard />
        </ListItem>
      </List>
    </Box>
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

export default History;
