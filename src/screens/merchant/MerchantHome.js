import { Box, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import {
  GrossSalesChart,
  ItemsSoldChart,
  SalesByProductChart,
  SalesProviderSuper,
  TotalOrdersChart,
} from "../../components/chart/SalesProvider";
import moment from "moment";

function MerchantHome(props) {
  const from = useMemo(() => moment().format("YYYY-MM-01"));
  const to = useMemo(() => moment().add(30, "days").format("YYYY-MM-01"));
  const [params, setParams] = useState({ from, to });
  return (
    <Box>
      <Box className="center-all" justifyContent="flex-end" p={2}>
        <Typography style={{ marginRight: 14 }}>Range</Typography>
        <Box>
          <TextField
            label="From"
            type="date"
            defaultValue={from}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setParams({ ...params, from: e.target.value });
            }}
            variant="outlined"
          />
          &nbsp;
          <TextField
            label="To"
            type="date"
            defaultValue={to}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setParams({ ...params, to: e.target.value });
            }}
            variant="outlined"
          />
        </Box>
      </Box>
      <Box className="center-all sales-card" justifyContent="flex-start">
        <SalesProviderSuper params={`&from=${params.from}&to=${params.to}`}>
          <GrossSalesChart />
          <ItemsSoldChart />
          <TotalOrdersChart />
        </SalesProviderSuper>
      </Box>
      <Box className="sales-card" display="block" width={400}>
        <SalesProviderSuper params={`&from=${params.from}&to=${params.to}`}>
          <SalesByProductChart />
        </SalesProviderSuper>
      </Box>
    </Box>
  );
}

export default MerchantHome;
