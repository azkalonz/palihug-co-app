import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import CurrencyFormat from "react-currency-format";

export function ProductCard(props) {
  const { product } = props;

  return product ? (
    <Paper style={{ marginBottom: 24, position: "relative" }}>
      {product.sale_price && (
        <SalePrice>
          {parseInt(
            (parseFloat(product.sale_price) /
              parseFloat(product.regular_price)) *
              100
          )}
          % OFF
        </SalePrice>
      )}
      <Box p={2}>
        <Box className={"product " + props.variant || "big"}>
          <img src={product.images[0].src} width="100%" alt={product.name} />
          <br />
          <Box>
            <Typography
              color="primary"
              variant="h5"
              style={{ fontWeight: 700 }}
            >
              {product.name}
            </Typography>

            {props.variant === "small" ? (
              <React.Fragment>
                <CurrencyFormat
                  prefix="PHP "
                  value={product.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(val) => (
                    <Typography style={{ fontWeight: "bold" }}>
                      {val}
                    </Typography>
                  )}
                />
                {props.children}
              </React.Fragment>
            ) : (
              <Price
                sale={product.sale_price}
                regularPrice={product.regular_price}
              >
                {product.price}
              </Price>
            )}
          </Box>
        </Box>
        {props.variant !== "small" && props.children}
      </Box>
    </Paper>
  ) : null;
}

export function Price(props) {
  return (
    <Box className="price">
      <Typography variant="h6" style={{ fontWeight: 700 }}>
        PHP{" "}
        {props.sale ? (
          <a style={{ textDecoration: "line-through", opacity: 0.72 }}>
            {props.regularPrice}
          </a>
        ) : null}{" "}
        {props.children}
      </Typography>
    </Box>
  );
}

export function SalePrice(props) {
  return (
    <Box className="sale-price">
      <Typography style={{ fontWeight: 700 }}>{props.children}</Typography>
    </Box>
  );
}

export function InputQuantity(props) {
  const [quantity, setQuantity] = useState(1);
  const removeQty = useCallback(() => {
    if (quantity > 1) {
      props.onChange(quantity - 1);
      setQuantity(quantity - 1);
    }
  }, [quantity]);
  const addQty = useCallback(() => {
    props.onChange(quantity + 1);
    setQuantity(quantity + 1);
  }, [quantity]);

  return (
    <React.Fragment>
      <ButtonGroup>
        <Button onClick={() => removeQty()}>
          <Icon>remove</Icon>
        </Button>
        <TextField type="number" value={quantity} />
        <Button onClick={() => addQty()}>
          <Icon>add</Icon>
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}
