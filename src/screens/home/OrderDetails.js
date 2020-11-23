import {
  Box,
  ButtonBase,
  List,
  ListItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import SwipeableViews from "react-swipeable-views";
import { Block } from ".";
import AnimateOnTap from "../../components/AnimateOnTap";
import EmptyListMessage from "../../components/EmptyListMessage";
import { Price, ProductCard } from "../../components/Product";
import ScreenHeader from "../../components/ScreenHeader";
import DialogContext from "../../context/DialogContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import UserContext from "../../context/UserContext";
import config from "../../misc/config";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { CartColumn } from "../services/Cart";

function OrderDetails(props) {
  const [order, setOrder] = useState();
  const [tabValue, setTabValue] = useState(0);
  const { order_id } = props.match.params;
  const { userContext } = useContext(UserContext);
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  useEffect(() => {
    setLoadingScreen({ visible: true });
    fetchData({
      send: async () =>
        await Api.get("/order/" + order_id + "?token=" + Api.getToken()),
      after: (data) => {
        if (data) {
          data.delivery_info = JSON.parse(data.delivery_info);
          setOrder(data);
        }
        setLoadingScreen({ visible: false });
      },
    });
  }, []);
  return order ? (
    <motion.div
      variants={slideBottom}
      initial="initial"
      animate="in"
      exit="out"
    >
      <Box p={3} bgcolor={config.palette.primary.pale}>
        <ScreenHeader title={"Order #" + order.order_id} />
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label="Info" />
          <Tab label="Products" />
          <Tab label="Note" />
        </Tabs>
        <Block
          p={0}
          title={
            <React.Fragment>
              Total&nbsp;
              <span style={{ color: "#000" }}>
                {order.products.length} Item(s)
              </span>
            </React.Fragment>
          }
        >
          <Price>
            <CurrencyFormat
              value={order.total}
              displayType={"text"}
              thousandSeparator={true}
            />
          </Price>
        </Block>
      </Box>
      <SwipeableViews
        onChangeIndex={(val) => setTabValue(val)}
        index={tabValue}
        resistance
      >
        <Box>
          <Block title="Delivery Info">
            <CartColumn title="Name">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.contact.name}
              </Typography>
            </CartColumn>
            <CartColumn title="Phone Number">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.contact.contact}
              </Typography>
            </CartColumn>
            <CartColumn title="Address">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.address.place_name}
              </Typography>
            </CartColumn>
            <Box
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${order.delivery_info.address.geometry.coordinates[1]},${order.delivery_info.address.geometry.coordinates[0]}`,
                  "_blank"
                );
              }}
            >
              <StaticMap
                width="100%"
                height={150}
                mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                latitude={order.delivery_info.address.geometry.coordinates[1]}
                longitude={order.delivery_info.address.geometry.coordinates[0]}
                zoom={15}
                className="checkout-static-map"
              >
                <Marker
                  latitude={order.delivery_info.address.geometry.coordinates[1]}
                  longitude={
                    order.delivery_info.address.geometry.coordinates[0]
                  }
                >
                  <div className={"center-pin"}>
                    <span className="icon-location"></span>
                  </div>
                </Marker>
              </StaticMap>
            </Box>
          </Block>
        </Box>
        <Box p={3}>
          {order.products.map((item) => {
            const p = JSON.parse(item.product_meta);
            return (
              <AnimateOnTap
                onClick={() =>
                  userContext?.user_type.name === "customer" &&
                  setDialogContext({
                    visible: true,
                    title: "Action",
                    message: (
                      <React.Fragment>
                        <List>
                          <ListItem
                            component={ButtonBase}
                            onClick={() => {
                              setDialogContext({
                                ...dialogContext,
                                visible: false,
                              });
                              props.history.push({
                                pathname: "/add-to-cart",
                                state: p,
                              });
                            }}
                          >
                            Buy Again
                          </ListItem>
                          <ListItem
                            component={ButtonBase}
                            onClick={() => {
                              setDialogContext({
                                ...dialogContext,
                                visible: false,
                              });
                              props.history.push(
                                "/merchant/" + p.store.vendor_id
                              );
                            }}
                          >
                            Visit Shop
                          </ListItem>
                        </List>
                      </React.Fragment>
                    ),
                  })
                }
              >
                <ProductCard product={p} key={p.id} variant="small">
                  <Typography>Quantity {item.order_qty}</Typography>
                  <Typography>Total {item.order_total}</Typography>
                </ProductCard>
              </AnimateOnTap>
            );
          })}
        </Box>
        <Box p={3}>
          {order.note ? (
            <CartColumn title="Customer's Note">
              <Paper elevation={1} style={{ padding: 14 }}>
                <Typography>{order.note}</Typography>
              </Paper>
            </CartColumn>
          ) : (
            <EmptyListMessage>Note is empty</EmptyListMessage>
          )}
        </Box>
      </SwipeableViews>
    </motion.div>
  ) : null;
}

export default OrderDetails;
