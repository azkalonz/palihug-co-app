import {
  Box,
  Container,
  Icon,
  IconButton,
  Slide,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import PinInput from "react-pin-input";
import GetStartedContext from "../context/GetStartedContext";
import UserContext from "../context/UserContext";
import { Alert } from "../screens/login/index";
import Api, { SocketApi } from "../utils/api";
import fetchData from "../utils/fetchData";
import SavingButton from "./SavingButton";

function VerifyOTP(props) {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const ucontext = useContext(UserContext);
  const { userContext, setUserContext } = ucontext;

  const resetOTP = useCallback(() => {
    setLoading(true);
    return fetchData({
      before: () => setLoading(true),
      send: async () =>
        await SocketApi.get("/otp-status?email=" + userContext.user_email),
      after: (data) => {
        if (data?.status) {
          setUserContext({ ...userContext, otpDuration: data.duration });
          setIsOtpSent(true);
        } else {
          setIsOtpSent(false);
        }
        setLoading(false);
      },
    });
  }, [userContext, isOtpSent, loading]);
  useEffect(() => {
    resetOTP();
  }, []);
  return (
    <GetStartedContext.Consumer>
      {(context) => {
        const { getStartedContext, setGetStartedContext } = context;
        if (getStartedContext.isOTPsent && !isOtpSent) {
          setIsOtpSent(true);
        } else if (isOtpSent && getStartedContext?.isOTPsent === false) {
          setGetStartedContext({ ...getStartedContext, isOTPsent: true });
        } else if (getStartedContext?.isOTPsent === null) {
          setIsOtpSent(false);
        }
        return (
          <React.Fragment>
            {isOtpSent ? (
              <EnterOTP {...props} />
            ) : (
              <SendOTP
                {...props}
                disabled={loading}
                setLoading={(e) => setLoading(e)}
                resetOTP={() => resetOTP()}
              />
            )}
          </React.Fragment>
        );
      }}
    </GetStartedContext.Consumer>
  );
}

function EnterOTP(props) {
  const [inputRef, setInputRef] = useState();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const context = useContext(GetStartedContext);
  const { getStartedContext, setGetStartedContext } = context;
  const [error, setError] = useState();
  const [otp, setOtp] = useState();
  const ucontext = useContext(UserContext);
  const { userContext, setUserContext } = ucontext;
  const verifyOTP = useCallback(() => {
    (async () => {
      setLoading(true);
      const body = {
        user_token: inputRef?.values?.join(""),
        user_email: userContext?.user_email,
      };
      const res = await Api.post("/verify-otp", { body });
      if (res?.user_id) {
        let body = { user_token: res.user_token };
        let user = await Api.post("/login", {
          body,
        });
        setUserContext(user);
        window.localStorage["user"] = JSON.stringify({ ...body });
        window.location = "/";
      } else if (res?.status === false) {
        setError(res?.message);
      } else {
        setError(res);
      }
      setLoading(false);
    })();
  }, [otp, getStartedContext.form, inputRef]);
  return (
    <GetStartedContext.Consumer>
      {(context) => {
        const { getStartedContext } = context;
        return (
          <ScreenTemplate1
            image="/static/laptop.png"
            title="Verify Email Address"
            subTitle={
              <React.Fragment>
                <Typography>
                  We sent a verification code to <br />
                  <b>{userContext?.user_email}</b>
                </Typography>
              </React.Fragment>
            }
            {...props}
            backDisabled={userContext?.user_id ? true : false}
          >
            <Box>
              <Snackbar open={error ? true : false} autoHideDuration={6000}>
                <Alert severity="error">Invalid Code</Alert>
              </Snackbar>
              <PinInput
                length={4}
                focus
                type="numeric"
                onChange={(e) => setOtp(e)}
                style={{
                  display: "flex",
                  maxWidth: 300,
                  margin: "17px auto",
                }}
                ref={(e) => setInputRef(e)}
                inputStyle={{
                  borderRadius: 13,
                  flex: 1,
                  borderColor: theme.palette.primary.main,
                }}
              />
              <SavingButton
                saving={loading}
                onClick={verifyOTP}
                className="themed-button"
                fullWidth
                style={{ marginTop: 18 }}
              >
                Verify
              </SavingButton>
              <CountDown
                context={{ getStartedContext, setGetStartedContext }}
              />
            </Box>
          </ScreenTemplate1>
        );
      }}
    </GetStartedContext.Consumer>
  );
}

function SendOTP(props) {
  const ucontext = useContext(UserContext);
  const { userContext } = ucontext;
  return (
    <GetStartedContext.Consumer>
      {(context) => {
        const { getStartedContext, setGetStartedContext } = context;
        return (
          <ScreenTemplate1
            image="/static/laptop.png"
            title="Continue with Email"
            subTitle="We will send One Time Password on this email address"
            {...props}
            backDisabled={userContext?.user_id}
          >
            <Box textAlign="center">
              <TextField
                className="themed-input"
                fullWidth
                variant="outlined"
                disabled={true}
                defaultValue={userContext?.user_email}
              />
              <SavingButton
                className="themed-button"
                style={{ width: "80%", marginTop: 32 }}
                onClick={async () => {
                  props.setLoading(true);
                  const { user_email, user_token } = userContext;
                  const res = await Api.post("/resend-otp", {
                    body: {
                      user_email,
                      user_token,
                    },
                  });
                  await props.resetOTP();
                  if (res?.user?.user_token) {
                    window.localStorage["user"] = JSON.stringify({
                      user_token: res.user.user_token * 1234,
                    });
                  }
                  setGetStartedContext({
                    ...getStartedContext,
                    isOTPsent: true,
                  });
                  props.setLoading(false);
                }}
                saving={props.disabled ? true : false}
              >
                Continue
              </SavingButton>
            </Box>
          </ScreenTemplate1>
        );
      }}
    </GetStartedContext.Consumer>
  );
}

function CountDown(props) {
  const ucontext = useContext(UserContext);
  const { getStartedContext, setGetStartedContext } = props.context;
  const { userContext } = ucontext;
  const [duration, setDuration] = useState(userContext?.otpDuration || 0);
  useEffect(() => {
    window.otpCountDown = setTimeout(() => {
      setDuration(duration - 1000);
      if (duration - 1000 <= 0) {
        window.clearTimeout(window.otpCountDown);
      }
    }, 1000);
  }, [duration]);
  return (
    <Box textAlign="center" p={2}>
      {duration > 0 && (
        <Typography>{moment.utc(duration).format("mm:ss")}</Typography>
      )}
      {duration <= 0 && (
        <Typography>
          Didn't receive the code?{" "}
          <a
            onClick={() => {
              setGetStartedContext({ ...getStartedContext, isOTPsent: null });
            }}
          >
            Resend Code
            {getStartedContext?.isOTPsent}
          </a>
        </Typography>
      )}
    </Box>
  );
}

export function ScreenTemplate1(props) {
  const { userContext } = useContext(UserContext);
  return (
    <GetStartedContext.Consumer>
      {(context) => {
        const { getStartedContext, setGetStartedContext } = context;
        return (
          <Slide
            in={true}
            direction={getStartedContext.page <= 2 ? "left" : "right"}
            onEntered={() => {
              if (getStartedContext.page > 2) {
                setGetStartedContext({
                  ...getStartedContext,
                  page: getStartedContext.page - 2,
                });
              } else {
                setGetStartedContext({
                  ...getStartedContext,
                  page: 2,
                });
              }
            }}
          >
            <Container
              style={{
                paddingTop: 13,
                display: "flex",
                justifyContent: "stretch",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => props.history.push("/register")}
                    className="back-button"
                    disabled={props.backDisabled ? true : false}
                  >
                    <Icon fontSize="large">navigate_before</Icon>
                  </IconButton>
                  {userContext?.user_id && (
                    <Typography>
                      <a
                        href="#"
                        onClick={() => {
                          window.localStorage.clear();
                          window.location = "/get-started";
                        }}
                      >
                        Logout
                      </a>
                    </Typography>
                  )}
                </Box>
                <Box textAlign="center" p={2}>
                  {typeof props.title === "string" ? (
                    <Typography
                      variant="h5"
                      color="primary"
                      style={{ fontWeight: 700 }}
                    >
                      {props.title}
                    </Typography>
                  ) : (
                    props.title
                  )}
                  {typeof props.subTitle === "string" ? (
                    <Typography color="textSecondary">
                      {props.subTitle}
                    </Typography>
                  ) : (
                    props.subTitle
                  )}
                </Box>
              </Box>
              <Box textAlign="center">
                <img src={props.image} width="200" />
              </Box>
              {props.children}
            </Container>
          </Slide>
        );
      }}
    </GetStartedContext.Consumer>
  );
}
export default VerifyOTP;
