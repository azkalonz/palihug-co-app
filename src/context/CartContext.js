import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const CartContext = React.createContext();
export const getCartContext = (setCartContext) => ({
  products: [],
  total: 0,
  getTotal: function (orders) {
    let t = 0;
    orders.map((p) => {
      t += parseInt(p.product.price);
    });
    this.total = t;
    return t;
  },
  addToCart: function (order, userContext, callback = () => {}) {
    let products = [...this.products];
    let productIndex = this.products.findIndex(
      (q) => q.product.id === order.product.id
    );
    if (productIndex >= 0) {
      products[productIndex].quantity += order.quantity;
    } else {
      products.push({ ...order, id: this.products.length });
    }
    const updatedContext = {
      ...this,
      products,
      total: (() => {
        let t = 0;
        products.map((p) => {
          t += parseInt(p.product.price) * p.quantity;
        });
        return t;
      })(),
    };
    console.log(updatedContext);
    fetchData({
      send: async () =>
        Api.post("/cart?token=" + userContext.user_token, {
          body: {
            meta: JSON.stringify(updatedContext),
            total_items: updatedContext.products.length,
            total_amount: updatedContext.total,
            user_id: userContext.user_id,
          },
        }),
      after: (data) => {
        callback(data);
        setCartContext(updatedContext);
      },
    });
  },
  emptyCart: function (setCartContext) {
    setCartContext({ ...this, total: 0, products: [] });
  },
  removeFromCart: function (order, userContext, callback = () => {}) {
    const orders = [...this.products];
    let orderIndex = this.products.findIndex(({ id }) => {
      return id === order.id;
    });
    if (orderIndex >= 0) {
      orders.splice(orderIndex, 1);
    }
    const updatedContext = {
      ...this,
      products: orders,
      total: this.getTotal(orders),
    };
    fetchData({
      send: async () =>
        Api.post("/cart?token=" + userContext.user_token, {
          body: {
            meta: JSON.stringify(updatedContext),
            total_items: updatedContext.products.length,
            total_amount: updatedContext.total,
            user_id: userContext.user_id,
          },
        }),
      after: (data) => {
        callback(data);
        setCartContext(updatedContext);
      },
    });
  },
});

export default CartContext;
