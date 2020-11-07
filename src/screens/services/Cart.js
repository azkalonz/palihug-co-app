import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { InputQuantity, ProductCard, Price } from "../../components/Product";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import { slideRight } from "../../misc/transitions";
import CurrencyFormat from "react-currency-format";
import { goBackOrPush } from "../../utils/goBackOrPush";
import CartContext from "../../context/CartContext";
import SavingButton from "../../components/SavingButton";
import EmptyListMessage from "../../components/EmptyListMessage";
import { Block } from "../home";
import Address from "../../components/Address";
import UserContext from "../../context/UserContext";
import DialogContext from "../../context/DialogContext";

function Cart(props) {
  const bcontext = useContext(BottomNavContext);
  const { add } = props.location?.state || {};
  const { cartContext, setCartContext } = useContext(CartContext);
  const { setDialogContext } = useContext(DialogContext);
  const { userContext } = useContext(UserContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
    if (add) {
      cartContext.addToCart(add);
    }
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="Cart" />
        {cartContext.products.length ? (
          <React.Fragment>
            <Block title="Delivery Info">
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
                <Address />
              </CartColumn>
            </Block>
            <Block title="Your Order">
              {cartContext.products.map((item) => (
                <ProductCard
                  product={item.product}
                  key={item.product.id}
                  variant="small"
                  header={
                    <Box position="absolute" top={0} right={0}>
                      <IconButton
                        onClick={() =>
                          setDialogContext({
                            visible: true,
                            title: "Remove to Cart",
                            message: (
                              <Box>
                                <Typography>
                                  Do you want to remove this item to your cart?
                                </Typography>
                                <ProductCard
                                  product={item.product}
                                  key={item.product.id}
                                  variant="small"
                                >
                                  <Typography>
                                    Quantity {item.quantity}
                                  </Typography>
                                </ProductCard>
                              </Box>
                            ),
                            actions: [
                              {
                                name: "YES",
                                callback: ({ closeDialog }) => {
                                  closeDialog();
                                  cartContext.removeFromCart(item);
                                },
                                props: {
                                  variant: "contained",
                                  color: "primary",
                                },
                              },
                              {
                                name: "Cancel",
                                callback: ({ closeDialog }) => closeDialog(),
                              },
                            ],
                          })
                        }
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    </Box>
                  }
                >
                  <Typography>Quantity {item.quantity}</Typography>
                </ProductCard>
              ))}
            </Block>
            <Block title="Note">
              <TextField
                inputProps={{ maxLength: 200 }}
                variant="outlined"
                label="Your Message"
                multiline
                helperText="Maximum of 200 Characters"
                fullWidth
              />
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
              >
                <Typography>Checkout</Typography>
              </SavingButton>
            </Block>
          </React.Fragment>
        ) : (
          <EmptyListMessage>Cart is empty</EmptyListMessage>
        )}
      </Box>
    </motion.div>
  );
}

export function AddToCart(props) {
  const bcontext = useContext(BottomNavContext);
  const [product, setProduct] = useState(props.location?.state || {});
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: false });
  }, []);
  return product.id ? (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title={!product.edit ? "Add To Cart" : "Edit Order"} />
        <Container>
          <ProductCard product={product}>
            <CartRow title="Quantity">
              <InputQuantity onChange={(qty) => setQuantity(qty)} />
            </CartRow>
            <CartRow title="Total">
              <Typography
                variant="h5"
                color="primary"
                style={{ fontWeight: 700 }}
              >
                <CurrencyFormat
                  value={quantity * product.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix="PHP "
                />
              </Typography>
            </CartRow>
          </ProductCard>
          <br />
          <Button
            className="themed-button"
            onClick={() => {
              props.history.replace({
                pathname: "/cart",
                state: {
                  add: {
                    product,
                    quantity,
                  },
                },
              });
            }}
          >
            Add To Cart
          </Button>
          <br />
          <br />
          <Button
            className="themed-button inverted"
            onClick={() => goBackOrPush("/")}
          >
            Cancel
          </Button>
        </Container>
      </Box>
    </motion.div>
  ) : null;
}

function CartRow(props) {
  return (
    <Box marginTop={3} className="center-all" justifyContent="space-between">
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
function CartColumn(props) {
  return (
    <Box marginBottom={3}>
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
export default Cart;
