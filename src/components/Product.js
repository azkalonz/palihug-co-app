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

export function ProductCard(props) {
  const { product } = props;

  return product ? (
    <Paper style={{ marginBottom: 24 }}>
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
            <Price>{product.price}</Price>
            {props.variant === "small" && props.children}
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
        PHP {props.children}
      </Typography>
    </Box>
  );
}

export function InputQuantity(props) {
  const [quantity, setQuantity] = useState(1);
  const removeQty = useCallback(() => {
    if (quantity > 1) setQuantity(quantity - 1);
    props.onChange(quantity);
  }, [quantity]);
  const addQty = useCallback(() => {
    setQuantity(quantity + 1);
    props.onChange(quantity);
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
