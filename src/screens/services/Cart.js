import { Box, Button, Container, Icon, Typography } from "@material-ui/core";
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

function Cart(props) {
  const bcontext = useContext(BottomNavContext);
  const { add, remove } = props.location?.state || {};
  const { cartContext, setCartContext } = useContext(CartContext);
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
    if (add) {
      const products = [
        ...cartContext.products,
        { ...add, id: cartContext.length },
      ];
      setCartContext({
        products,
        total: (() => {
          let t = 0;
          products.map((p) => {
            t += parseInt(p.product.price);
          });
          return t;
        })(),
      });
      const notifications = { ...bottomNavContext.notifications };
      if (notifications["cart"]) notifications["cart"]++;
      else notifications["cart"] = 1;
      setBottomNavContext({ ...bottomNavContext, notifications });
      console.log(add);
    }
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="Cart" />
        {cartContext.products.length ? (
          <React.Fragment>
            {cartContext.products.map((item) => (
              <ProductCard
                product={item.product}
                key={item.product.id}
                variant="small"
              >
                <Typography>Quantity {item.quantity}</Typography>
              </ProductCard>
            ))}
            <Box
              marginTop={3}
              className="center-all"
              justifyContent="space-between"
            >
              <Typography style={{ marginRight: 10 }}>Total</Typography>
              <Price>
                <CurrencyFormat
                  value={cartContext.total}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </Price>
            </Box>
            <br />
            <br />
            <SavingButton
              className="themed-button"
              startIcon={<Icon>https</Icon>}
            >
              <Typography variant="h6">Checkout</Typography>
            </SavingButton>
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
            <Box
              marginTop={3}
              className="center-all"
              justifyContent="space-between"
            >
              <Typography style={{ marginRight: 10 }}>Quantity</Typography>
              <InputQuantity onChange={(qty) => setQuantity(qty)} />
            </Box>
            <Box
              marginTop={3}
              className="center-all"
              justifyContent="space-between"
            >
              <Typography style={{ marginRight: 10 }}>Total</Typography>
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
            </Box>
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

export default Cart;
