import { Box, Icon, TextField, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import PinMap from "../../components/PinMap";
import { Price } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import CartContext from "../../context/CartContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import { fadeInOut, slideBottom, slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { Block } from "../home";
import { CartColumn, OrdersBlock } from "./Cart";

function Checkout(props) {
  const [address, setAddress] = useState(null);
  const { userContext } = useContext(UserContext);
  const { cartContext, setCartContext } = useContext(CartContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const [selecting, setSelecting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address,
    contact: userContext.default_address
      ? {
          name: userContext.default_address.name,
          contact: userContext.default_address.contact,
        }
      : {},
  });
  const submitOrder = useCallback(() => {
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/checkout?token=" + userContext.user_token, {
          body: {
            consumer_user_id: userContext.user_id,
            service_id: 1,
            payment_id: 1,
            total: cartContext.total,
            delivery_info: JSON.stringify(deliveryInfo),
            status_text: "Finding you a rider",
            note,
            products: cartContext.products.map((q) => ({
              prod_id: q.product.id,
              order_qty: q.quantity,
              order_total: eval(q.product.price * q.quantity),
              merchant_id: q.product.store.vendor_id,
              product_meta: JSON.stringify(q.product),
            })),
          },
        }),
      after: (order) => {
        setSaving(false);
        fetchData({
          send: async () => Api.delete("/cart?token=" + userContext.user_token),
          after: () => {
            cartContext.emptyCart(setCartContext);
            setOrderContext({
              ...orderContext,
              orders: [order, ...orderContext.orders],
            });
            props.history.replace("/orders/" + order.order_id);
          },
        });
      },
    });
  }, [deliveryInfo, cartContext, userContext, note]);
  useEffect(() => {
    if (userContext.default_address) {
      setDeliveryInfo({
        address: !Object.keys(userContext?.default_address || {}).length
          ? deliveryInfo.address
          : (() => {
              const {
                street,
                barangay,
                city,
                house_number,
                zip,
              } = userContext.default_address;
              return `${
                street ? street + ", " : ""
              }${barangay}, ${city}, ${zip}`;
            })(),
        contact: {
          name: userContext.default_address.name,
          contact: userContext.default_address.contact,
        },
      });
    }
  }, [userContext.default_address]);
  useEffect(() => {
    setDeliveryInfo({ ...deliveryInfo, address });
  }, [address]);
  return (
    <motion.div variants={fadeInOut} initial="initial" exit="out" animate="in">
      {selecting && (
        <motion.div
          variants={slideBottom}
          initial="initial"
          exit="out"
          animate="in"
        >
          <PinMap
            onChange={(address) => {
              setSelecting(false);
              setAddress(address);
            }}
            address={address}
          />
        </motion.div>
      )}

      {!selecting && (
        <Box height="100vh" overflow="auto" paddingBottom={10}>
          <motion.div
            variants={slideRight}
            initial="initial"
            exit="out"
            animate="in"
          >
            <Box p={3}>
              <ScreenHeader
                title="Checkout"
                pushTo={() => {
                  setSelecting(true);
                }}
              />
              <Block title="Delivery Info" p={0}>
                <TextField
                  defaultValue={deliveryInfo.contact.name}
                  variant="outlined"
                  label="Name"
                  className="themed-input"
                  fullWidth
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      contact: {
                        ...deliveryInfo.contact,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  defaultValue={deliveryInfo.contact.contact}
                  variant="outlined"
                  className="themed-input"
                  label="Contact Number"
                  fullWidth
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      contact: {
                        ...deliveryInfo.contact,
                        contact: e.target.value,
                      },
                    })
                  }
                />
                <br />
                <br />
                <CartColumn title="Address">
                  <Typography style={{ fontWeight: 700 }} color="primary">
                    {address.place_name}
                  </Typography>
                </CartColumn>
                <div onClick={() => setSelecting(true)}>
                  <StaticMap
                    width="100%"
                    height={150}
                    mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    latitude={address.geometry.coordinates[1]}
                    longitude={address.geometry.coordinates[0]}
                    zoom={15}
                    className="checkout-static-map"
                  >
                    <Marker
                      latitude={address.geometry.coordinates[1]}
                      longitude={address.geometry.coordinates[0]}
                    >
                      <div className={"center-pin"}>
                        <span className="icon-location"></span>
                      </div>
                    </Marker>
                  </StaticMap>
                </div>
              </Block>
              <Block title="Note" p={0}>
                <TextField
                  inputProps={{ maxLength: 200 }}
                  variant="outlined"
                  label="Your Message"
                  multiline
                  helperText="Maximum of 200 Characters"
                  fullWidth
                  onChange={(e) => setNote(e.target.value)}
                />
              </Block>
              <OrdersBlock />
              <Block title="Payment" p={0}>
                <CartColumn title="Method">
                  <Typography style={{ fontWeight: 700 }} color="primary">
                    Cash on delivery
                  </Typography>
                </CartColumn>
              </Block>
              <Block
                title={
                  <React.Fragment>
                    Total&nbsp;
                    <span style={{ color: "#000" }}>
                      {cartContext.products.length} Item(s)
                    </span>
                  </React.Fragment>
                }
                p={0}
              >
                <Price>
                  <CurrencyFormat
                    value={cartContext.total}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Price>
                <br />
                <br />
                <SavingButton
                  className="themed-button"
                  startIcon={<Icon>https</Icon>}
                  saving={saving}
                  onClick={submitOrder}
                >
                  <Typography>Submit Order</Typography>
                </SavingButton>
              </Block>
            </Box>
          </motion.div>
        </Box>
      )}
    </motion.div>
  );
}

export default Checkout;
