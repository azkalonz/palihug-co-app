import { Button } from "@material-ui/core";
import React, { useCallback } from "react";

export function Home(props) {
  const logout = useCallback(() => {
    window.localStorage.clear();
    window.location = "/";
  }, []);
  return (
    <div>
      home
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
