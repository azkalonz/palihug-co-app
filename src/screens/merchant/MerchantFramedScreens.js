import { Container } from "@material-ui/core";
import React from "react";
import OrderDetails from "../home/OrderDetails";

export function FramedOrderDetails(props) {
  return (
    <Frame>
      <OrderDetails {...props} />
    </Frame>
  );
}
function Frame(props) {
  return <Container>{props.children}</Container>;
}
