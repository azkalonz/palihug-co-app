import {
  Badge,
  BottomNavigation as BottomNav,
  BottomNavigationAction,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import BottomNavContext from "../context/BottomNavContext";
import { slideBottom } from "../misc/transitions";
function BottomNavigation(props) {
  const history = useHistory();
  const bcontext = useContext(BottomNavContext);
  const { bottomNavContext } = bcontext;
  const [selected, setSelected] = useState("");
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
          label: "Cart",
          icon: "icon-cart-alt md",
          iconStyle: {
            color: "#b9b8b8",
          },
          value: "cart",
          url: "/cart",
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
          relatedUrls: ["/info"],
        },
      ].map((q) =>
        q.value === selected ? { ...q, icon: q.icon.replace("-alt", "") } : q
      ),
    [selected]
  );
  useEffect(() => {
    menu.forEach((m) => {
      const currentUrl = window.location.pathname;
      if (m.url === currentUrl) setSelected(m.value);
      else if (m.relatedUrls) {
        m.relatedUrls.forEach((mm) => {
          if (mm === currentUrl) setSelected(m.value);
        });
      }
    });
  }, [menu]);
  useEffect(() => {
    const m = menu.find((q) => q.url === window.location.pathname);
    if (!m) setSelected("");
    else setSelected(m.value);
  }, [window.location.pathname, menu]);
  return bcontext.bottomNavContext?.visible ? (
    <motion.div
      initial="initial"
      exit="out"
      animate="in"
      variants={slideBottom}
      className="bottom-navigation"
    >
      <BottomNav value={selected} onChange={(evt, val) => setSelected(val)}>
        {menu.map((m, index) => {
          return (
            <BottomNavigationAction
              onClick={() => {
                history.push(m.url);
              }}
              icon={
                bottomNavContext.notifications[m.value] ? (
                  <Badge
                    badgeContent={bottomNavContext.notifications[m.value]}
                    color="error"
                  >
                    <span
                      className={m.icon}
                      {...(m.iconStyle ? { style: m.iconStyle } : {})}
                    />
                  </Badge>
                ) : (
                  <span
                    className={m.icon}
                    {...(m.iconStyle ? { style: m.iconStyle } : {})}
                  />
                )
              }
              label={m.label}
              value={m.value}
              key={m.value}
            />
          );
        })}
      </BottomNav>
    </motion.div>
  ) : null;
}

export default BottomNavigation;
