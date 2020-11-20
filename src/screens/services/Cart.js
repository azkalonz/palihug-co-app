import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import EmptyListMessage from "../../components/EmptyListMessage";
import { InputQuantity, Price, ProductCard } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import DialogContext from "../../context/DialogContext";
import UserContext from "../../context/UserContext";
import { slideRight } from "../../misc/transitions";
import { goBackOrPush } from "../../utils/goBackOrPush";
import { Block } from "../home";

function Cart(props) {
  const bcontext = useContext(BottomNavContext);
  const { cartContext } = useContext(CartContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="Cart" />
        {cartContext.products.length ? (
          <React.Fragment>
            <OrdersBlock />
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
                onClick={() => props.history.push("/checkout")}
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

export function OrdersBlock(props) {
  const { cartContext } = useContext(CartContext);
  const { setDialogContext } = useContext(DialogContext);
  const { userContext } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Block title="Your Order">
      {cartContext.products.map((item) => (
        <ProductCard
          product={item.product}
          key={item.product.id}
          variant="small"
          header={
            <Box position="absolute" top={10} right={0}>
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
                          <Typography>Quantity {item.quantity}</Typography>
                        </ProductCard>
                      </Box>
                    ),
                    actions: [
                      {
                        name: "YES",
                        callback: ({ closeDialog, setLoading }) => {
                          setLoading(true);
                          cartContext.removeFromCart(item, userContext, () => {
                            closeDialog();
                            setLoading(false);
                            enqueueSnackbar("Removed", {
                              variant: "success",
                            });
                          });
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
  );
}

export function AddToCart(props) {
  const bcontext = useContext(BottomNavContext);
  const { userContext } = useContext(UserContext);
  const [product, setProduct] = useState(props.location?.state || {});
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const { cartContext } = useContext(CartContext);
  const addToCart = useCallback((order) => {
    setSaving(true);
    cartContext.addToCart(order, userContext, () => {
      setSaving(false);
      props.history.replace("/cart");
    });
  }, []);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: false });
  }, []);
  return product.id ? (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader
          title={!product.edit ? "Add To Cart" : "Edit Order"}
          disabled={saving}
        />
        <Container>
          <ProductCard product={product}>
            <CartRow title="Quantity">
              <InputQuantity
                onChange={(qty) => setQuantity(qty)}
                disabled={saving}
              />
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
          <SavingButton
            saving={saving}
            className="themed-button"
            onClick={() => addToCart({ product, quantity })}
            disabled={saving}
          >
            Add To Cart
          </SavingButton>
          <br />
          <br />
          <Button
            className="themed-button inverted"
            onClick={() => goBackOrPush("/")}
            disabled={saving}
          >
            Cancel
          </Button>
        </Container>
      </Box>
    </motion.div>
  ) : null;
}

export function CartRow(props) {
  return (
    <Box marginTop={3} className="center-all" justifyContent="space-between">
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
export function CartColumn(props) {
  return (
    <Box marginBottom={3}>
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
export default Cart;
