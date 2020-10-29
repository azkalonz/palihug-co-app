import { ButtonBase, Icon } from "@material-ui/core";
import React from "react";
import { slideRightFunc } from "../misc/transitions";
import AnimateOnTap from "./AnimateOnTap";

function CartIcon(props) {
  return (
    <AnimateOnTap
      className="floating-cart-icon center-all"
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRightFunc({
        out: {
          x: "100%",
          opacity: 0,
        },
      })}
    >
      <ButtonBase>
        <Icon>shopping_cart</Icon>
      </ButtonBase>
    </AnimateOnTap>
  );
}

export default CartIcon;
