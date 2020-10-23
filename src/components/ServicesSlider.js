import { Box, Icon, Slide, Typography } from "@material-ui/core";
import React, { useCallback, useContext, useState } from "react";
import Carousel from "react-material-ui-carousel";
import ServicesContext from "../context/ServicesContext";
import UserContext from "../context/UserContext";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import SavingButton from "./SavingButton";

function ServicesSlider(props) {
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(true);
  const scontext = useContext(ServicesContext);
  const ucontext = useContext(UserContext);
  const { servicesContext } = scontext;
  const { userContext, setUserContext } = ucontext;
  const [userInfo, setUserInfo] = useState(userContext);

  const ServiceSlide = useCallback((s) => {
    return (
      <Box key={s.id} className="service-slide">
        <img src={s.service_icon_b} alt={s.service_name} />
        <Typography color="primary" variant="h4" style={{ fontWeight: "700" }}>
          {s.service_name}
        </Typography>
        <Typography color="textPrimary" variant="h6">
          {s.subname}
        </Typography>
      </Box>
    );
  }, []);
  const handleSkip = useCallback(() => {
    setSaving(true);
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/first-login", {
          body: {
            user_email: userContext?.user_email,
            user_token: userContext?.user_token,
          },
        }),
      after: (userData) => {
        setUserInfo(userData);
        setSaving(false);
        setOpen(false);
      },
    });
  }, [saving, open, userContext]);

  return (
    <Slide
      direction={"up"}
      in={open}
      onExited={() => {
        setUserContext(userInfo);
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        height="80%"
      >
        <Carousel
          animation="slide"
          interval={3000}
          className="service-carousel"
        >
          {servicesContext.length
            ? servicesContext.map((service) => ServiceSlide(service))
            : null}
        </Carousel>
        <Box textAlign="center">
          <SavingButton
            className="themed-button auto-width"
            saving={saving}
            onClick={() => handleSkip()}
          >
            <Icon>navigate_next</Icon>
          </SavingButton>
          <Typography style={{ marginTop: 10 }}>Skip</Typography>
        </Box>
      </Box>
    </Slide>
  );
}

export default ServicesSlider;
