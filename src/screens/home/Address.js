import {
  Box,
  Button,
  FormControlLabel,
  Icon,
  List,
  ListItem,
  TextField,
  Checkbox,
  Typography,
  IconButton,
} from "@material-ui/core";
import { CheckBox } from "@material-ui/icons";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AnimateOnTap from "../../components/AnimateOnTap";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import UserContext from "../../context/UserContext";
import { fadeInOut, slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

function Address(props) {
  const bcontext = useContext(BottomNavContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { default_address, address } = useMemo(() => userContext || {}, [
    userContext,
  ]);
  const [selected, setSelected] = useState(
    default_address ? default_address.add_id : 0
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  useEffect(() => {
    setSelected(default_address?.add_id || 0);
  }, [default_address]);
  const onSave = useCallback(() => {
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/add-address/default", {
          body: {
            add_id: selected,
            user_token: userContext.user_token,
          },
        }),
      after: (data) => {
        if (data?.success) {
          address["default_address"] = data.address;
          setUserContext({ ...userContext, ...address });
        }
        setSaving(false);
      },
    });
  }, [saving, selected]);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideBottom}
    >
      <Box p={3}>
        <ScreenHeader title="Address" />
        {isAdding ? (
          <motion.div
            animate="in"
            exit="out"
            initial="initial"
            variants={fadeInOut}
          >
            <AddAddress cancel={() => setIsAdding(false)} />
          </motion.div>
        ) : (
          <React.Fragment>
            <List>
              {Object.keys(default_address).length ? (
                <ListItem className="address-detail default">
                  {(() => {
                    const {
                      street,
                      barangay,
                      city,
                      province,
                      zip,
                      house_number,
                      country,
                    } = default_address;
                    return (
                      <Box
                        className="center-all"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Box className="center-all">
                            <Icon>home</Icon>
                            <Typography style={{ fontWeight: 800 }}>
                              DEFAULT ADDRESS
                            </Typography>
                          </Box>
                          <Typography>
                            {house_number} {street}, {barangay}
                          </Typography>
                          <Typography>
                            {city}, {zip}
                          </Typography>
                          <Typography>
                            {province}, {country}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() => {
                              for (let m in default_address) {
                                form[m] = default_address[m];
                              }
                              setIsAdding(true);
                            }}
                          >
                            <Icon>create</Icon>
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })()}
                </ListItem>
              ) : (
                <Typography variant="h5" color="textSecondary">
                  Select a default address
                </Typography>
              )}
              <br />
              {address?.length
                ? address
                    .filter((q) => {
                      if (default_address?.add_id) {
                        return q.add_id !== default_address.add_id;
                      } else {
                        return true;
                      }
                    })
                    .map((add, index) => {
                      const {
                        street,
                        barangay,
                        city,
                        province,
                        zip,
                        house_number,
                        country,
                      } = add;
                      return (
                        <ListItem
                          selected={add.add_id === selected}
                          key={index}
                          className="address-detail"
                          onClick={() => setSelected(add.add_id)}
                          divider
                        >
                          <Box
                            className="center-all"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography>
                                {house_number} {street}, {barangay}
                              </Typography>
                              <Typography>
                                {city}, {zip}
                              </Typography>
                              <Typography>
                                {province}, {country}
                              </Typography>
                            </Box>
                            {selected === add.add_id && (
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    for (let m in add) {
                                      form[m] = add[m];
                                    }
                                    setIsAdding(true);
                                  }}
                                >
                                  <Icon>create</Icon>
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </ListItem>
                      );
                    })
                : null}
            </List>
            <AnimateOnTap>
              <Button
                className="themed-button inverted"
                variant="contained"
                onClick={() => setIsAdding(true)}
              >
                <Icon>add</Icon>
              </Button>
            </AnimateOnTap>
            <br />
            <SavingButton
              saving={saving}
              className="themed-button "
              variant="contained"
              onClick={() => onSave()}
            >
              Save
            </SavingButton>
          </React.Fragment>
        )}
      </Box>
    </motion.div>
  );
}
const form = {};
function AddAddress(props) {
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
          props.cancel();
        }
        setSaving(false);
      },
    });
  }, []);
  return (
    <React.Fragment>
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
            checked={form["is_default"]}
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
            props.cancel();
          }}
        >
          Cancel
        </Button>
      </AnimateOnTap>
    </React.Fragment>
  );
}

export default Address;
