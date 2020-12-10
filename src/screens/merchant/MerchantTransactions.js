import { Box, Button, Link } from "@material-ui/core";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { getOR } from "../services/Checkout";
import moment from "moment";

function MerchantTransactions(props) {
  const [transactions, setTransactions] = useState();
  useEffect(() => {
    fetchData({
      send: async () =>
        await Api.get("/orders/merchant?token=" + Api.getToken()),
      after: (data) => {
        setTransactions(data);
      },
    });
  }, []);
  return (
    <Box p={3}>
      <MaterialTable
        data={transactions}
        isLoading={typeof transactions !== "object"}
        options={{
          filtering: true,
        }}
        onRowClick={(e, row) => props.history.push("/orders/" + row.order_id)}
        title={
          <Box className="center-all" justifyContent="flex-start">
            <ScreenHeader noGoBack title="Transactions" />
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                window.open(
                  Api.getUrl("/export/orders?token=" + Api.getToken()),
                  "_blank"
                )
              }
            >
              Export
            </Button>
          </Box>
        }
        columns={[
          {
            title: "Order Num",
            field: "order_id",
            render: (row) => "#" + getOR(row.order_id),
          },
          {
            title: "Date",
            type: "date",
            field: "created_at",
            render: (row) => moment(row.created_at).format("llll"),
          },
          {
            title: "Provider",
            field: "provider_name",
          },
          {
            title: "Customer",
            field: "consumer_name",
          },
          {
            title: "Note",
            field: "note",
          },
          {
            title: "Total",
            field: "total",
            type: "currency",
            currencySetting: {
              locale: "ph",
              currencyCode: "PHP",
            },
          },
          {
            title: "Status",
            field: "status",
            lookup: {
              pending: <b className="pending">Pending</b>,
              processing: <b className="processing">Processing</b>,
              receiving: <b className="receiving">Receiving</b>,
              received: <b className="received">Received</b>,
              cancelled: <b className="cancelled">Cancelled</b>,
            },
          },
          {
            title: "Delivery Info",
            field: "delivery_info",
            render: (row) => {
              const { address, contact } = JSON.parse(row.delivery_info);
              return (
                <React.Fragment>
                  <b>Address: </b>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${address.geometry.coordinates[1]},${address.geometry.coordinates[0]}`}
                    target="_blank"
                  >
                    {address.place_name}
                  </Link>
                  <br />
                  <b>Name: </b>
                  {contact.name}
                  <br />
                  <b>Contact: </b>
                  {contact.contact}
                </React.Fragment>
              );
            },
          },
        ]}
      />
    </Box>
  );
}

export default MerchantTransactions;
