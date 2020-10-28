import {
  Box,
  ButtonBase,
  Icon,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { motion, useElementScroll, useTransform } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";

function Merchant(props) {
  const ref = useRef();
  const { merchant_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const bcontext = useContext(BottomNavContext);
  const { scrollYProgress } = useElementScroll(ref);
  const [progress, setProgress] = useState(0);
  const [merchant, setMerchant] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const translateX = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 60]);
  const translateY = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, -100]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.2]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.5, 1]);
  const iconColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#ffffff", "#757575"]
  );
  const borderRadius = useTransform(scrollYProgress, [0, 1], [30, 0]);
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: false,
    });
  }, []);
  useEffect(() => {
    if (merchant_id) {
      fetchData({
        before: () => setLoadingScreen(true),
        send: async () => await Api.get("/merchants/" + merchant_id + "/data"),
        after: (data) => {
          console.log(data);
          const { categories, products, merchant } = data;
          setMerchant(merchant);
          setProducts(products);
          setCategories(categories);
          setLoadingScreen(false);
        },
      });
    }
  }, [merchant_id]);
  scrollYProgress.onChange(setProgress);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideBottom}
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
      <Box style={{ height: "100%", overflow: "auto" }} ref={ref}>
        <Box style={{ height: "100%" }}>
          <Box className="merchant-banner">
            <motion.img
              src={
                "http://192.168.0.106/storage/merchants/" +
                merchant.merch_banner
              }
              alt={merchant.merch_name}
              width="100%"
              style={{ opacity: imgOpacity, scale: imgScale }}
            />
          </Box>
          <motion.div className="merchant-content" style={{ borderRadius }}>
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
            </motion.div>
            <Products categories={categories} products={products} />
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}

function Products(props) {
  const { categories, products } = props;
  const [tabValue, setTabValue] = useState(0);
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
    [products]
  );
  return (
    <Box className="column-flex-100">
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
