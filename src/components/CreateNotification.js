import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@material-ui/core";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import UserSearch from "./UserSearch";

function CreateNotification(props) {
  const { open, setOpen } = props.controls;
  const [forEveryone, setForEveryone] = useState(true);
  const [sendTo, setSendTo] = useState(null);
  const titleRef = useRef();
  const bodyRef = useRef();
  const textFieldProps = useMemo(
    () => ({
      variant: "outlined",
      fullWidth: true,
    }),
    []
  );
  const onSubmit = useCallback(() => {
    const form = {
      consumer_user_id: -1,
      notif_type: "update",
    };
    const meta = {
      title: titleRef.current.value,
      body: bodyRef.current.value,
    };
    if (!forEveryone && sendTo !== null) {
      form.consumer_user_id = sendTo;
    }
    form.notif_meta = JSON.stringify(meta);
    fetchData({
      send: async () =>
        await Api.post("/notifications?token=" + Api.getToken(), {
          body: form,
        }),
      after: (data) => {
        console.log(data);
      },
    });
  }, [sendTo, forEveryone]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Send Notifications</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={titleRef}
          type="text"
          label="Title"
          placeholder="Title"
          {...textFieldProps}
        />
        <br />
        <br />
        <TextField
          inputRef={bodyRef}
          type="text"
          label="Body"
          placeholder="Body"
          multiline={true}
          rows={3}
          {...textFieldProps}
        />
        <br />
        <br />
        <FormControlLabel
          control={
            <Switch
              checked={forEveryone}
              onChange={(e) => setForEveryone(e.target.checked)}
            />
          }
          label="Send to all users"
        />
        {!forEveryone && (
          <React.Fragment>
            <br />
            <br />
            <UserSearch
              onChange={(val) => {
                setSendTo(val.user_id);
              }}
            />
          </React.Fragment>
        )}
        <Button
          onClick={onSubmit}
          className="themed-input"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNotification;
