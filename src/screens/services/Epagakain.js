import {
  Box,
  Button,
  ButtonBase,
  Icon,
  Paper,
  Typography,
} from "@material-ui/core";
import { CarouselProvider, Slide, Slider } from "pure-react-carousel";
import React from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import HorizontalScroll from "../../components/HorizontalScroll";
import ScreenHeader from "../../components/ScreenHeader";

function Epagakain(props) {
  const { merchants } = props.service;
  return (
    <Box width="100vw" height={200}>
      <Box p={3}>
        <ScreenHeader
          title={
            <Box className="center-all" justifyContent="flex-start">
              <Icon color="primary">room</Icon>
              <Button>Enter your address</Button>
            </Box>
          }
        />
      </Box>
      <HorizontalScroll>
        {merchants.map((m, i) => (
          <Box key={i} width={150} height={200} m={1}>
            <AnimateOnTap whileTap={{ opacity: 0.8 }}>
              <MerchantCard merchant={m} />
            </AnimateOnTap>
          </Box>
        ))}
      </HorizontalScroll>
    </Box>
  );
}
function MerchantCard(props) {
  const { merch_banner, merch_name, merch_wp_id } = props.merchant;
  return (
    <Box
      className="inherit-all"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width={150}
      height={200}
      overflow="hidden"
      borderRadius={20}
      component={Paper}
      onClick={() => history.push("/merchant/" + merch_wp_id)}
    >
      <Box
        component={ButtonBase}
        display="flex"
        className="inherit-all"
        justifyContent="center"
        overflow="hidden"
      >
        <img
          src={"http://localhost/storage/merchants/" + merch_banner}
          alt={merch_name}
          height="100%"
          width="auto"
        />
      </Box>
      <Box p={2}>
        <Typography
          color="primary"
          style={{
            fontWeight: 700,
            fontSize: "1.2em",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {merch_name}
        </Typography>
      </Box>
    </Box>
  );
}

export default Epagakain;
