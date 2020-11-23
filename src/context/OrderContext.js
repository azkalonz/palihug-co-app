import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const OrderContext = React.createContext();
export const getOrderContext = (setOrderContext) => ({
  orders: [],
});

export default OrderContext;
