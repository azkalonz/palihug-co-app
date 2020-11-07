import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Icon,
  IconButton,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useCallback, useContext } from "react";
import DialogContext from "../context/DialogContext";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h2"
        style={{ fontSize: 21, fontWeight: 600, ...(props.titleProps || {}) }}
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Icon>close</Icon>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
function DialogComponent(props) {
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  const closeDialog = useCallback(
    () => setDialogContext({ ...dialogContext, visible: false }),
    [dialogContext]
  );
  return (
    <Dialog open={dialogContext.visible} onClose={() => closeDialog()}>
      <DialogTitle onClose={() => closeDialog()}>
        {dialogContext.title}
      </DialogTitle>
      <DialogContent>{dialogContext.message}</DialogContent>
      <DialogActions>
        {dialogContext.actions?.map((action, index) => (
          <Button
            key={index}
            {...(action.props ? action.props : {})}
            onClick={() => action.callback({ closeDialog, dialogContext })}
          >
            {action.name}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;
