import { Box, Button, Container, Slide, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

function GetStarted(props) {
  return (
    <Slide direction="right" in={true}>
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
              src="/static/car_phone_bike.png"
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
              <Typography variant="h5">
                Leading company of errands service.
              </Typography>
              <Typography>
                Serving you with the best of our abilities and help fellow
                online sellers and all other start-up business
              </Typography>
            </Box>
            <Box width="100%" textAlign="center" paddingBottom={4}>
              <Button
                variant="contained"
                className="themed-button inverted"
                color="primary"
                onClick={() => props.history.push("/register")}
              >
                Get Started
              </Button>
              <Typography className="have-account">
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Slide>
  );
}

export default GetStarted;
