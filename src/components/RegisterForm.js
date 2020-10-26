import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import GetStartedContext from "../context/GetStartedContext";
import UserContext from "../context/UserContext";
import { slideRight } from "../misc/transitions";
import Api from "../utils/api";
import SavingButton from "./SavingButton";
import ScreenHeader from "./ScreenHeader";

function RegisterForm(props) {
  const formRef = useRef();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(false);
  const context = useContext(GetStartedContext);
  const { getStartedContext, setGetStartedContext } = context;
  const ucontext = useContext(UserContext);
  const { userContext, setUserContext } = ucontext;

  const form = useMemo(() => {
    if (getStartedContext.form) {
      return getStartedContext.form;
    } else {
      return {};
    }
  }, [getStartedContext.form]);
  const onSubmit = useCallback(
    (callback) => {
      if (formRef.current && !saving) {
        (async () => {
          setSaving(true);
          const t = await Api.post("/register", {
            body: form,
          }).catch((e) => {});
          if (!t?.user && !userContext?.user_id) {
            if (typeof t === "object") {
              Object.keys(t).forEach((k) => {
                if (!t[k][0]) return;
                t[k][0] = t[k][0].replace("lname", "last name");
                t[k][0] = t[k][0].replace("fname", "first name");
              });
              setErrors(t);
            }
          } else {
            window.localStorage["user"] = JSON.stringify({
              user_token: t.user.user_token * 1234,
            });
            callback();
            setGetStartedContext({
              ...getStartedContext,
              form,
              isRegistered: true,
            });
            setUserContext(t.user);
            props.history.push("/verify-otp");
          }
          setSaving(false);
        })();
      }
    },
    [formRef]
  );

  const onChange = useCallback(
    (e, type) => {
      form[type] = e.target.value;
    },
    [form]
  );
  const textFieldProps = useCallback(
    (type) => ({
      InputLabelProps: {
        shrink: true,
      },
      variant: "outlined",
      fullWidth: true,
      className: "themed-input",
      inputProps: {
        style: { fontWeight: 600 },
      },
      disabled: saving || getStartedContext.isRegistered || userContext.user_id,
      ...(form[type] || userContext[type]
        ? { defaultValue: form[type] || userContext[type] }
        : {}),
      ...(errors[type] ? { helperText: errors[type], error: true } : {}),
    }),
    [saving, errors, form, getStartedContext.isRegistered, userContext]
  );

  useEffect(() => {
    if (userContext?.user_id) {
      props.history.push("verify-otp");
    }
  }, []);

  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRight}
      transition="tween"
    >
      <Container style={{ paddingTop: 13 }}>
        <Box>
          <ScreenHeader title="Registration" path="/get-started" />
          <Typography color="textSecondary">Welcome</Typography>
          <Typography variant="h6" color="primary" style={{ fontWeight: 700 }}>
            Hey there, fill up the form to continue.
          </Typography>
        </Box>
        <Box>
          <form style={{ width: "inherit" }} ref={formRef}>
            <TextField
              label="First Name"
              placeholder="e.g Juan"
              onChange={(e) => onChange(e, "user_fname")}
              {...textFieldProps("user_fname")}
            />
            <TextField
              label="Last Name"
              placeholder="e.g Dela Cruz"
              onChange={(e) => onChange(e, "user_lname")}
              {...textFieldProps("user_lname")}
            />
            <TextField
              label="Email address"
              placeholder="e.g juan@email.com"
              onChange={(e) => onChange(e, "user_email")}
              {...textFieldProps("user_email")}
            />
            <TextField
              label="Password"
              type="password"
              onChange={(e) => onChange(e, "user_password")}
              {...textFieldProps("user_password")}
            />
          </form>
          <FormControlLabel
            control={
              <Checkbox
                checked={form["user_agree"]}
                onChange={(e) => {
                  form["user_agree"] = e.target.checked ? 1 : 0;
                }}
              />
            }
            {...textFieldProps("type")}
            label={
              <React.Fragment>
                <Typography style={{ fontSize: 12 }}>
                  By creating an account, you agree to our{" "}
                  <a style={{ whiteSpace: "pre" }}>Terms and Conditions</a>
                </Typography>
                {errors["user_agree"] && (
                  <Typography
                    className="error"
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    {errors["user_agree"]}
                  </Typography>
                )}
              </React.Fragment>
            }
          />
        </Box>
        <Box p={3}>
          <SavingButton
            fullWidth
            variant="contained"
            className="themed-button inverted"
            onClick={() =>
              onSubmit(() => {
                setGetStartedContext({
                  ...getStartedContext,
                  page: getStartedContext.page + 1,
                });
              })
            }
            saving={saving}
          >
            Next
          </SavingButton>
          <Typography className="have-account">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
}

export default RegisterForm;
