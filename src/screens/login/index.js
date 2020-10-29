import { Box, TextField, Typography } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { history } from "../../App";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import { ScreenTemplate1 } from "../../components/VerifyOTP";
import UserContext from "../../context/UserContext";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";

export function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const form = {};
export function Login(props) {
  const ucontext = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [errors, setErrors] = useState({});
  const textFieldProps = useCallback(
    (type) => ({
      variant: "outlined",
      fullWidth: true,
      className: "themed-input",
      disabled: loading,
      ...(errors[type] ? { helperText: errors[type], error: true } : {}),
    }),
    [errors, loading]
  );
  const onChange = useCallback((e, type) => {
    form[type] = e.target.value;
  }, []);
  const onSubmit = useCallback(() => {
    fetchData({
      before: () => {
        setErrors({});
        setError({});
        setLoading(true);
      },
      send: async () =>
        await Api.post("/login", {
          body: {
            ...form,
          },
        }),
      onError: (e) => {
        if (e.response) setErrors(e.response.data.errors);
      },
      after: (data) => {
        if (!data?.user_token) {
          setError(data);
        } else if (data?.user_token) {
          if (data.user_token) {
            window.localStorage["user"] = JSON.stringify({
              user_token: data.user_token,
            });
            if (data.user) ucontext.setUserContext(data.user);
            else if (data.user_email) ucontext.setUserContext(data);
            if (data.user_status === "Verified") {
              history.push("/");
            } else {
              history.push("/verify-otp");
            }
          }
        }
        setLoading(false);
      },
    });
  }, []);
  return (
    <ScreenTemplate1
      title={<ScreenHeader path="/get-started" title="Welcome Back" />}
      subTitle="Good day! Sign in to continue."
      {...props}
    >
      <Snackbar
        open={error?.message ? true : false}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error?.message}
        </Alert>
      </Snackbar>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
      >
        <Box>
          <form>
            <TextField
              label="Email"
              {...textFieldProps("user_email")}
              type="email"
              onChange={(e) => onChange(e, "user_email")}
            />
            <TextField
              label="Password"
              type="password"
              onChange={(e) => onChange(e, "user_password")}
              {...textFieldProps("user_password")}
            />
          </form>
        </Box>
        <Box textAlign="center">
          <SavingButton
            style={{ width: "80%" }}
            className="themed-button"
            onClick={onSubmit}
            saving={loading}
          >
            Sign in
          </SavingButton>
        </Box>
        <Box textAlign="center">
          <Typography className="have-account">
            Dont have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Box>
    </ScreenTemplate1>
  );
}
