import { Box, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

function Spinner(props) {
  const templates = useMemo(
    () => ({
      home: HomeSpinner,
    }),
    []
  );
  const SpinnerTemplate = useMemo(() => {
    if (props.variant) {
      if (templates[props.variant]) {
        return templates[props.variant];
      }
    }
    return CircularProgress;
  }, []);
  return (
    <Box className="spinner">
      {props.image ? (
        <motion.div
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
          }}
          style={{ width: 100, pointerEvents: "none", opacity: 0.7 }}
        >
          <img
            src="/static/images/logo/vertical.png"
            width="100%"
            alt="Loading"
          />
        </motion.div>
      ) : (
        <SpinnerTemplate />
      )}
    </Box>
  );
}
function HomeSpinner(props) {
  return (
    <Box height="100%" width="100%" maxWidth="810px">
      <Skeleton width="100%" height={170} />
      <br />
      <Box p={3} paddingTop={0}>
        <Skeleton width={120} height={30} />
        <br />
        <Box className="services">
          {new Array(4).fill(1).map((service, index) => (
            <Skeleton
              className="service"
              key={index}
              height={60}
              style={{ marginBottom: 14 }}
            />
          ))}
        </Box>
        <Skeleton width={200} height={30} />
        <br />
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {new Array(10).fill(1).map((q, i) => (
            <Box
              key={i}
              width={150}
              height={200}
              flex="0 0 47%"
              marginBottom={2}
              style={{ opacity: 1 - i / 6 }}
            >
              <Skeleton width="100%" height="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Spinner;
