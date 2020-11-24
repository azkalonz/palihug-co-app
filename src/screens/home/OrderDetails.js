import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Icon,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import SwipeableViews from "react-swipeable-views";
import { Block } from ".";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import EmptyListMessage from "../../components/EmptyListMessage";
import { Price, ProductCard } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import DialogContext from "../../context/DialogContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import config from "../../misc/config";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { CartColumn } from "../services/Cart";
const qs = require("query-string");

function OrderDetails(props) {
  const query = qs.parse(window.location.search);
  const [order, setOrder] = useState();
  const [tabValue, setTabValue] = useState(0);
  const { order_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const { setDialogContext } = useContext(DialogContext);
  const { setOrderContext, orderContext } = useContext(OrderContext);
  const { userContext } = useContext(UserContext);
  const acceptOrder = useCallback(() => {
    setDialogContext({
      visible: true,
      noClose: true,
      title: "Accepting order...",
      message: (
        <Box width="100%" className="center-all">
          <LinearProgress style={{ width: "100%" }} />
        </Box>
      ),
    });
    fetchData({
      send: async () =>
        await Api.post("/accept-order?token=" + Api.getToken(), {
          body: {
            order_id,
          },
        }),
      after: (data) => {
        console.log(data);
        orderContext.updateOrder(data, setOrderContext);
        setDialogContext({ visible: false });
        props.history.replace("/orders");
      },
    });
  }, []);
  useEffect(() => {
    if (!isNaN(parseInt(query.tab))) setTabValue(parseInt(query.tab));
  }, [query.tab]);
  const showDriverOptions = useCallback(() => {
    setDialogContext({
      title: "Action",
      visible: true,
      message: (
        <React.Fragment>
          <List>
            <ListItem component={ButtonBase} onClick={acceptOrder}>
              Accept Order
            </ListItem>
          </List>
        </React.Fragment>
      ),
    });
  }, []);
  useEffect(() => {
    setLoadingScreen({ visible: true });
    fetchData({
      send: async () =>
        await Api.get("/order/" + order_id + "?token=" + Api.getToken()),
      after: (data) => {
        if (data && !data.error) {
          data.delivery_info = JSON.parse(data.delivery_info);
          setOrder(data);
        } else if (data?.error) {
          window.location = "/";
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
        <ScreenHeader
          title={"Order #" + order.order_id}
          pushTo={() => props.history.replace("/orders")}
        >
          {userContext.user_type.name === "driver" && (
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={showDriverOptions}
            >
              <Icon>more_vert</Icon>
            </IconButton>
          )}
        </ScreenHeader>
        <Tabs value={tabValue}>
          <Tab
            label="Info"
            onClick={() =>
              props.history.push({
                pathname: props.location.pathname,
                search: "tab=0",
              })
            }
          />
          <Tab
            label="Products"
            onClick={() =>
              props.history.push({
                pathname: props.location.pathname,
                search: "tab=1",
              })
            }
          />
          <Tab
            label="Note"
            onClick={() =>
              props.history.push({
                pathname: props.location.pathname,
                search: "tab=2",
              })
            }
          />
          <Tab
            label="Chat"
            onClick={() =>
              props.history.push({
                pathname: props.location.pathname,
                search: "tab=3",
              })
            }
          />
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
          style={{ marginTop: 16 }}
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
        onChangeIndex={(val) =>
          props.history.push({
            pathname: props.location.pathname,
            search: "tab=" + val,
          })
        }
        index={tabValue}
        resistance
      >
        <Box>
          <Block title="Status">
            <Chip
              label={order.status.toUpperCase()}
              color="primary"
              className={"chip " + order.status}
            />
          </Block>
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
        {userContext?.user_type.name === "customer" ? (
          <Box p={3}>
            <Products order={order} />
          </Box>
        ) : (
          <ProductsByVendor order={order} />
        )}
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
        <Box p={3}>
          {order.status === "pending" ? (
            <EmptyListMessage>
              You may use the chat feature once this order is accepted.
              <br />
              {userContext.user_type.name === "driver" && (
                <SavingButton onClick={acceptOrder} className="themed-button">
                  Accept Order
                </SavingButton>
              )}
            </EmptyListMessage>
          ) : (
            <Button
              className="themed-button"
              onClick={() =>
                props.history.push({
                  pathname: "/chat",
                  state: order,
                })
              }
            >
              Open Chat
            </Button>
          )}
        </Box>
      </SwipeableViews>
    </motion.div>
  ) : null;
}
function ProductsByVendor(props) {
  const { order } = props;
  const [vendors, setVendors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  useEffect(() => {
    let v = {};
    if (order?.products?.length) {
      order.products.map((item) => {
        const p = JSON.parse(item.product_meta);
        v[p.store.vendor_display_name] = p.store;
        v[p.store.vendor_display_name].orders = [];
      });
      order.products.map((item) => {
        const p = JSON.parse(item.product_meta);
        const storeName = p.store.vendor_display_name;
        delete p.store;
        delete item.product_meta;
        v[storeName].orders.push({ product: p, ...item });
      });
    }
    setVendors(v);
  }, []);
  return (
    <React.Fragment>
      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
        {Object.keys(vendors).map((vendor, index) => (
          <Tab
            label={
              <Box className="center-all">
                {vendor}
                <IconButton
                  onClick={() => {
                    history.push(
                      `/merchant/${vendors[vendor].vendor_id}/details`
                    );
                  }}
                >
                  <Icon>open_in_new</Icon>
                </IconButton>
              </Box>
            }
            key={vendor.vendor_id}
          />
        ))}
      </Tabs>
      <SwipeableViews
        index={tabValue}
        onChangeIndex={(val) => setTabValue(val)}
        resistance
      >
        {Object.keys(vendors).map((vendor, index) => (
          <Box key={vendor.vendor_id} p={3}>
            {vendors[vendor].orders?.map((order) => {
              const p = order.product;

              return (
                <ProductCard product={p} key={p.id} variant="small">
                  <Typography>Quantity {order.order_qty}</Typography>
                  <Typography>Total {order.order_total}</Typography>
                </ProductCard>
              );
            })}
          </Box>
        ))}
      </SwipeableViews>
    </React.Fragment>
  );
}
function Products(props) {
  const { userContext } = useContext(UserContext);
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  return props.order?.products.map((item) => {
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
                      props.history.push("/merchant/" + p.store.vendor_id);
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
  });
}
export default OrderDetails;
