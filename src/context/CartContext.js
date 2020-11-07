import React from "react";

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
  addToCart: function (order) {
    const products = [...this.products, { ...order, id: this.products.length }];
    setCartContext({
      ...this,
      products,
      total: (() => {
        let t = 0;
        products.map((p) => {
          t += parseInt(p.product.price);
        });
        return t;
      })(),
    });
  },
  removeFromCart: function (order) {
    const orders = [...this.products];
    let orderIndex = this.products.findIndex(({ id }) => {
      return id === order.id;
    });
    if (orderIndex >= 0) {
      orders.splice(orderIndex, 1);
    }
    setCartContext({
      ...this,
      products: orders,
      total: this.getTotal(orders),
    });
  },
});

export default CartContext;
