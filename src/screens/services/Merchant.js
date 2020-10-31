import {
  Box,
  ButtonBase,
  Icon,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";
import CartIcon from "../../components/CartIcon";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import {
  fadeInOut,
  fadeInOutFunc,
  slideBottom,
  slideRightFunc,
} from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";

function Merchant(props) {
  return (
    <React.Fragment>
      <MerchantView {...props}>
        <CartIcon />
      </MerchantView>
    </React.Fragment>
  );
}

function MerchantView(props) {
  const ref = useRef();
  const { merchant_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const bcontext = useContext(BottomNavContext);
  const [merchant, setMerchant] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState();
  const [contentYState, setContentY] = useState(0);
  const contentY = useMotionValue(0);
  const translateX = useTransform(contentY, [-175, 0], [60, 0]);
  const translateY = useTransform(contentY, [-175, 0], [-100, 0]);
  const imgOpacity = useTransform(contentY, [-175, 0], [0.2, 0.7]);
  const logoOpacity = useTransform(contentY, [-175, 0], [1, 0]);
  const nameOpacity = useTransform(contentY, [-175, 0], [0, 1]);
  const imgScale = useTransform(contentY, [-175, 0], [1, 1.5]);
  const iconColor = useTransform(contentY, [-175, 0], ["#757575", "#ffffff"]);
  const borderRadius = useTransform(contentY, [-175, 0], [0, 30]);
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: false,
    });
  }, []);
  useEffect(() => {
    if (merchant_id) {
      fetchData({
        before: () => setLoadingScreen(false),
        send: async () => await Api.get("/merchants/" + merchant_id + "/data"),
        after: (data) => {
          if (data) {
            const { categories, products, merchant } = data;
            setMerchant(merchant);
            setProducts(products);
            setCategories(categories);
            setLoadingScreen(false);
          }
        },
      });
    }
  }, [merchant_id]);
  contentY.onChange((t) => {
    setContentY(t);
  });
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={fadeInOutFunc({
        out: {
          transition: {
            delay: 0.2,
          },
        },
      })}
      style={{ height: "100%", overflow: "hidden" }}
    >
      <AnimateOnTap className="fixed left">
        <IconButton
          className="back-button"
          onClick={() => {
            goBackOrPush(props.path || "/");
          }}
        >
          <motion.span
            style={{ color: iconColor }}
            className="material-icons MuiIcon-root MuiIcon-fontSizeLarge"
          >
            <Icon fontSize="large">navigate_before</Icon>
          </motion.span>
        </IconButton>
      </AnimateOnTap>
      <AnimateOnTap className="fixed right">
        <IconButton
          className="back-button"
          onClick={() => {
            goBackOrPush(props.path || "/");
          }}
        >
          <motion.span
            style={{ color: iconColor, scale: 0.8 }}
            className="material-icons MuiIcon-root MuiIcon-fontSizeLarge"
          >
            <Icon fontSize="large">search</Icon>
          </motion.span>
        </IconButton>
      </AnimateOnTap>
      <Box style={{ height: "100%" }} ref={ref}>
        <Box style={{ height: "100%" }}>
          <Box
            className={
              "merchant-banner" + (merchant.merch_banner ? "" : " no-image")
            }
          >
            {merchant.merch_banner && (
              <motion.img
                src={
                  "http://192.168.0.106/storage/merchants/" +
                  merchant.merch_banner
                }
                alt={merchant.merch_name}
                width="100%"
                style={{ opacity: imgOpacity, scale: imgScale }}
              />
            )}
          </Box>
          <motion.div
            animate="in"
            exit="out"
            initial="initial"
            variants={slideBottom}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="merchant-content-header"
              style={{ borderRadius }}
              drag="y"
              dragConstraints={{
                top: -175,
                bottom: 0,
              }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 20 }}
              y={contentY}
            >
              <Icon
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  opacity: 0.7,
                }}
              >
                drag_handle
              </Icon>
              <motion.div
                style={{
                  translateX,
                  translateY,
                  opacity: nameOpacity,
                  padding: 24,
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  variant="h4"
                >
                  {merchant.vendor?.vendor_shop_name}
                </Typography>
                {!merchant.vendor?.errors &&
                  !merchant.vendor?.vendor_shop_name && (
                    <Skeleton animation="wave" width="40%" height={55} />
                  )}
              </motion.div>
              <motion.img
                src={"/static/images/logo/horizontal.png"}
                alt={merchant.merch_name}
                className="merchant-logo"
                style={{ opacity: logoOpacity }}
              />
            </motion.div>

            <Products
              categories={categories}
              products={products}
              y={contentYState}
            />
          </motion.div>
        </Box>
      </Box>
      {props.children}
    </motion.div>
  );
}

function Products(props) {
  const { categories, products } = props;
  const [tabValue, setTabValue] = useState(0);
  const { cartContext, setCartContext } = useContext(CartContext);
  const ListProducts = useCallback(
    (category) => {
      const p = products?.filter((q) => {
        const forThisCategory = q.categories?.find((qq) => {
          return qq.id === category.id;
        });
        return !!forThisCategory;
      });
      return (
        <React.Fragment>
          {p?.map((product, index) => {
            const image = product?.images[0] ? product.images[0].src : "";
            return (
              <Box
                width="100%"
                key={index}
                display="flex"
                justifyContent="flex-start"
                component={ButtonBase}
                onClick={() =>
                  setCartContext({
                    products: [...cartContext.products, product],
                  })
                }
              >
                <Box
                  minWidth={100}
                  minHeight={100}
                  width={100}
                  overflow="hidden"
                  borderRadius={20}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  m={2}
                >
                  <img src={image} alt={product.name} width="100%" />
                </Box>
                <Box textAlign="left">
                  <Typography style={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography color="primary" style={{ fontWeight: 600 }}>
                    PHP {product.price}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </React.Fragment>
      );
    },
    [products, cartContext.products]
  );
  return (
    <Box
      className="column-flex-100"
      style={{ transform: `translateY(${props.y}px)` }}
      className="merchant-content-view"
    >
      {categories && products?.length === 0 ? (
        <Box p={2} height="100vh" textAlign="center" width="100%">
          <Typography variant="h5">No available products</Typography>
        </Box>
      ) : null}
      {!categories && (
        <React.Fragment>
          <Box className="center-all">
            {new Array(3).fill(1).map((q, i) => (
              <Box
                key={i}
                p={2}
                width="33%"
                height={30}
                paddingRight={i === 2 ? 2 : 0}
              >
                <Skeleton animation="wave" width="inherit%" height="inherit" />
              </Box>
            ))}
          </Box>
          <Box marginTop={4}>
            {new Array(2).fill(1).map((q, i) => (
              <Box
                key={i}
                p={2}
                marginBottom={1}
                paddingTop={0}
                width="100%"
                className="center-all"
                style={{ opacity: 1 - i / 2 }}
              >
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={100}
                  style={{ minWidth: 100, marginRight: 10 }}
                  height={100}
                />
                <Skeleton animation="wave" width="100%" height={100} />
              </Box>
            ))}
          </Box>
        </React.Fragment>
      )}
      <Tabs
        centered
        value={tabValue}
        fullWidth
        onChange={(e, val) => setTabValue(val)}
      >
        {categories?.map((category, index) => (
          <Tab
            key={index}
            label={<AnimateOnTap>{category.name}</AnimateOnTap>}
          ></Tab>
        ))}
      </Tabs>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ height: "100%" }}
      >
        {categories?.map((category, index) => ListProducts(category))}
      </SwipeableViews>
    </Box>
  );
}

export default Merchant;
