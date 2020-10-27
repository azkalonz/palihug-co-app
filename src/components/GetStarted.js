import { Box, Button, Container, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fadeInOut } from "../misc/transitions";
import { notForThisRoute, routingRules } from "../utils/route-rules";
import AnimateOnTap from "./AnimateOnTap";

function GetStarted(props) {
  useEffect(() => {
    notForThisRoute("IF_NOT_LOGGED_IN", function (rule) {
      console.log(rule);
    });
  }, [routingRules]);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={fadeInOut}>
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="100vh"
        >
          <Box
            textAlign="center"
            height="50%"
            p={3}
            display="flex"
            alignItems="flex-end"
          >
            <img
              src="/static/images/car-phone-bike.svg"
              width="100%"
              alt="Get Started"
            />
          </Box>
          <Box
            height="50%"
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Box textAlign="center">
              <Typography variant="h5">ESGO</Typography>
              <Typography>Errand Service On The Go!</Typography>
            </Box>
            <Box width="100%" textAlign="center" paddingBottom={4}>
              <AnimateOnTap>
                <Button
                  variant="contained"
                  className="themed-button inverted"
                  color="primary"
                  onClick={() => props.history.push("/register")}
                >
                  Get Started
                </Button>
              </AnimateOnTap>
              <Typography className="have-account">
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}

export default GetStarted;
