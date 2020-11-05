import { Box, Button, ButtonBase, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import { history } from "../App";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import AnimateOnTap from "./AnimateOnTap";
import { Price, SalePrice } from "./Product";

function ProductArchive(props) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPage, setLastPage] = useState(false);

  const getProducts = useCallback(() => {
    fetchData({
      before: async () => setLoading(true),
      send: async () =>
        await Api.post("/products", {
          body: {
            per_page: 5,
            page,
            ...(props.params ? props.params : {}),
          },
        }),
      after: (data) => {
        if (data.length) setProducts([...products, ...data]);
        else setLastPage(true);
        setLoading(false);
        setPage(page + 1);
      },
    });
  }, [page]);
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <React.Fragment>
      <Box className="product-archive">
        {products &&
          products.map((product) => (
            <Box
              key={product.id}
              className="product"
              component={ButtonBase}
              onClick={() =>
                history.push({
                  pathname: "/add-to-cart",
                  state: product,
                })
              }
            >
              <div className="image">
                <img src={product.images[0].src} alt={product.name} />
              </div>
              <Typography>{product.name}</Typography>
              <Price>{product.price}</Price>
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
            </Box>
          ))}
        {loading &&
          new Array(5)
            .fill(1)
            .map((q, i) => (
              <Skeleton
                className="product"
                height={200}
                key={i}
                style={{ marginBottom: 24 }}
              />
            ))}
      </Box>
      {!loading && !lastPage && (
        <AnimateOnTap>
          <Button
            className="themed-button inverted"
            onClick={() => getProducts()}
          >
            Load More
          </Button>
        </AnimateOnTap>
      )}
    </React.Fragment>
  );
}

export default ProductArchive;
