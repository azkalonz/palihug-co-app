import { createMuiTheme } from "@material-ui/core";
import config from "./config";

const defaultTheme = createMuiTheme();
export default createMuiTheme({
  palette: {
    ...config.palette,
  },
  overrides: {
    MuiPaper: {
      elevation1: {
        boxShadow: "0 8px 11px rgba(121,121,121,0.14)",
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: config.palette.primary.main,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 20,
      },
    },
    MuiTabs: {
      root: {
        overflow: "auto!important",
      },
      scroller: {
        overflow: "auto!important",
      },
    },
    MuiTab: {
      root: {
        "&.Mui-selected": {
          fontWeight: 800,
          color: config.palette.primary.main,
        },
      },
    },
    MuiTypography: {
      root: {
        "&.error": {
          color: "#ff8d00",
          fontWeight: 400,
        },
        "&.have-account": {
          fontWeight: 500,
          marginTop: 13,
        },
        fontFamily: "'Montserrat', sans-serif!Important",
        "& a:link,& a:visited": {
          color: config.palette.primary.main + "!important",
          textDecoration: "none",
        },
      },
    },
    MuiFormHelperText: {
      root: {
        "&.Mui-error": {
          color: "#ff8d00",
        },
      },
    },
    MuiButtonBase: {
      root: {
        "&.back-button": {
          marginLeft: -24,
          "& span": {
            fontSize: "3.25rem",
          },
        },
        "&.themed-button": {
          borderRadius: 32,
          boxShadow: "none",
          overflow: "hidden",
          padding: defaultTheme.spacing(2),
          width: "100%",
          "&:not(.inverted):hover,&.inverted": {
            backgroundColor: config.palette.primary.pale,
            color: config.palette.primary.main,
          },
          "&.inverted:hover,&:not(.inverted)": {
            color: config.palette.primary.pale,
            backgroundColor: config.palette.primary.main,
          },
        },
      },
    },
    MuiTextField: {
      root: {
        "&.themed-input": {
          marginTop: 30,
          "& .Mui-focused": {
            "& input": {
              borderColor: config.textField.focused.borderColor,
            },
          },
          "& label": {
            top: -10,
            left: -10,
            "&:not(.MuiFormLabel-filled):not(.Mui-focused):not(.MuiInputLabel-shrink)": {
              top: -5,
              left: -5,
            },
            "&.Mui-error": {
              color: "#ff8d00",
            },
          },
          "& .Mui-error input": {
            border: "1px solid #ff8d00",
          },
          "& input": {
            border: "1px solid #999",
            borderRadius: 13,
            height: 7,
          },
          "& fieldset": {
            display: "none",
          },
        },
      },
    },
  },
});
