import { Box, Button, Icon } from "@material-ui/core";
import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { goAddressPage } from "../utils/goBackOrPush";

function Address(props) {
  const { userContext } = useContext(UserContext);
  return (
    <Box className="center-all" justifyContent="flex-start">
      <Icon color="primary">room</Icon>
      <Button onClick={() => goAddressPage()} style={{ whiteSpace: "pre" }}>
        {!Object.keys(userContext?.default_address || {}).length
          ? "Enter your address"
          : (() => {
              const { street, barangay, city } = userContext.default_address;
              return `${street}, ${barangay}, ${city}`;
            })()}
      </Button>
    </Box>
  );
}

export default Address;
