import {
  BottomNavigation as BottomNav,
  BottomNavigationAction,
} from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import PageContext from "../context/PageContext";

function BottomNavigation(props) {
  const history = useHistory();
  const pcontext = useContext(PageContext);
  const [selected, setSelected] = useState("home");
  const menu = useMemo(
    () =>
      [
        {
          label: "Home",
          icon: "icon-home-alt md",
          value: "home",
          url: "/",
        },
        {
          label: "History",
          icon: "icon-task-alt md",
          value: "history",
          url: "/history",
        },
        {
          label: "Notifications",
          icon: "icon-bell-alt md",
          value: "notifications",
          url: "/notifications",
        },
        {
          label: "Profile",
          icon: "icon-user-alt md",
          value: "profile",
          url: "/profile",
        },
      ].map((q) =>
        q.value === selected ? { ...q, icon: q.icon.replace("-alt", "") } : q
      ),
    [selected]
  );
  useEffect(() => {
    menu.forEach((m) => {
      if (m.url === window.location.pathname) setSelected(m.value);
    });
  }, [menu]);
  return (
    <BottomNav
      value={selected}
      onChange={(evt, val) => setSelected(val)}
      className="bottom-navigation"
    >
      {menu.map((m, index) => {
        return (
          <BottomNavigationAction
            onClick={() => {
              history.push(m.url);
            }}
            icon={<span className={m.icon} />}
            label={m.label}
            value={m.value}
            key={m.value}
          />
        );
      })}
    </BottomNav>
  );
}

export default BottomNavigation;
