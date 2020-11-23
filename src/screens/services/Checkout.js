import { Box, Icon, TextField, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import PinMap from "../../components/PinMap";
import { Price } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import CartContext from "../../context/CartContext";
import UserContext from "../../context/UserContext";
import { fadeInOut, slideBottom, slideRight } from "../../misc/transitions";
import { Block } from "../home";
import { CartColumn, OrdersBlock } from "./Cart";

function Checkout(props) {
  const [address, setAddress] = useState(null);
  const { userContext } = useContext(UserContext);
  const { cartContext } = useContext(CartContext);
  const [selecting, setSelecting] = useState(true);
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
                {Object.keys(userContext.default_address || {}).length ? (
                  <React.Fragment>
                    <CartColumn title="Name">
                      <Typography style={{ fontWeight: 700 }} color="primary">
                        {userContext?.default_address?.name}
                      </Typography>
                    </CartColumn>
                    <CartColumn title="Number">
                      <Typography style={{ fontWeight: 700 }} color="primary">
                        {userContext?.default_address?.contact}
                      </Typography>
                    </CartColumn>
                  </React.Fragment>
                ) : null}
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
                  onClick={() => props.history.push("/checkout")}
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
