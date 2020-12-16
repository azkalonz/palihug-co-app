import { Box } from "@material-ui/core";
import React from "react";
import OrderTracking from "../../components/OrderTracking";

function AdminHome(props) {
  return (
    <Box p={3}>
      <Box width="100%">
        <OrderTracking />
      </Box>
    </Box>
  );
}

export default AdminHome;
