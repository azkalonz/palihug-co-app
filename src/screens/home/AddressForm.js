import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AnimateOnTap from "../../components/AnimateOnTap";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import UserContext from "../../context/UserContext";
import { slideBottom, slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

const form = {};
function AddressForm(props) {
  let state = props.location?.state;
  if (state) {
    Object.keys(state).forEach((s) => {
      form[s] = state[s];
    });
  }
  const [saving, setSaving] = useState(false);
  const { userContext, setUserContext } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const textFieldProps = useCallback(
    (type) => ({
      variant: "outlined",
      fullWidth: true,
      className: "themed-input",
      disabled: saving,
      defaultValue: form[type] || "",
      ...(errors[type] ? { helperText: errors[type], error: true } : {}),
    }),
    [errors, saving]
  );
  const onChange = useCallback((e, type) => {
    form[type] = e.target.value;
  }, []);
  const clearForm = () => {
    for (var member in form) delete form[member];
  };
  const onSave = useCallback(() => {
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/add-address", {
          body: {
            ...form,
            user_token: userContext.user_token,
            user_id: userContext.user_id,
          },
        }),
      after: (data) => {
        if (data && !data.success) {
          setErrors(data);
        } else if (data.success && data.address) {
          clearForm();
          const address = {};
          address["address"] = [...userContext.address];
          let index = address["address"].findIndex(
            (q) => q.add_id === data.address.add_id
          );
          if (index >= 0) address["address"][index] = data.address;
          else address["address"].push(data.address);
          if (data.address.is_default)
            address["default_address"] = data.address;
          setUserContext({ ...userContext, ...address });
          props.history.replace("/address");
        }
        setSaving(false);
      },
    });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="New Address" />
        <TextField
          label="House/Building No."
          {...textFieldProps("house_number")}
          onChange={(e) => onChange(e, "house_number")}
        />
        <TextField
          label="Street"
          {...textFieldProps("street")}
          onChange={(e) => onChange(e, "street")}
        />
        <TextField
          label="Barangay"
          {...textFieldProps("barangay")}
          onChange={(e) => onChange(e, "barangay")}
        />
        <TextField
          label="City/Municipality"
          {...textFieldProps("city")}
          onChange={(e) => onChange(e, "city")}
        />
        <TextField
          label="Province"
          {...textFieldProps("province")}
          onChange={(e) => onChange(e, "province")}
        />
        <TextField
          label="Zip code"
          {...textFieldProps("zip")}
          onChange={(e) => onChange(e, "zip")}
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={form["is_default"]}
              onChange={(e) => {
                form["is_default"] = e.target.checked ? 1 : 0;
              }}
            />
          }
          {...textFieldProps("type")}
          label={
            <React.Fragment>
              <Typography>Set as default address</Typography>
              {errors["is_default"] && (
                <Typography
                  className="error"
                  style={{
                    fontSize: "0.75rem",
                  }}
                >
                  {errors["is_default"]}
                </Typography>
              )}
            </React.Fragment>
          }
        />
        <SavingButton
          saving={saving}
          className="themed-button "
          variant="contained"
          onClick={() => onSave()}
        >
          {form.add_id ? "Save" : "Add"}
        </SavingButton>
        <br />
        <AnimateOnTap>
          <Button
            className="themed-button inverted"
            variant="contained"
            onClick={() => {
              clearForm();
              props.history.replace("/address");
            }}
          >
            Cancel
          </Button>
        </AnimateOnTap>
      </Box>
    </motion.div>
  );
}

export default AddressForm;
