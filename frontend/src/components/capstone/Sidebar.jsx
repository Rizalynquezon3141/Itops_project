import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import { ChevronLeft } from "@mui/icons-material";
import logo from "../../images/bigLogo.png";
import textLogo from "../../images/textLogo.png";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const MiniDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : 72,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : 72,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon fontSize="large" />, link: "/home" },
    {
      text: "Patients",
      icon: <Person2Icon fontSize="large" />,
      link: "/patients",
    },
    {
      text: "Schedule",
      icon: <CalendarTodayIcon fontSize="large" />,
      link: "/schedule",
    },
    {
      text: "Blog",
      icon: <BookIcon fontSize="large" />,
      link: "/blog",
    },
    {
      text: "Admin Settings",
      icon: <SettingsIcon fontSize="large" />,
      link: "/AdminSettings",
    },
  ];

  return (
    <>
      {isMobile && (
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      )}

      <MiniDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <div className="flex items-center flex-col justify-between p-4">
          <Box sx={{ width: "100%" }} display="flex" justifyContent="end">
            <IconButton onClick={toggleDrawer}>
              {open ? <MenuIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          {open ? (
            <Box
              display="flex"
              className="sm:flex-col md:flex-row justify-start relative w-full"
            >
              <img
                className="w-[60%] h-[100%] object-cover"
                src={logo}
                alt="safeplace"
              />
              <img
                className="w-[70%] h-[100%] object-cover absolute right-[-10%]"
                src={textLogo}
                alt="safeplace"
              />
            </Box>
          ) : (
            <img className="w-full object-cover" src={logo} alt="safeplace" />
          )}
        </div>

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {menuItems.map((item) => (
            <ListItem
              button
              component={NavLink}
              to={item.link}
              key={item.text}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "1rem",
                borderLeft:
                  location.pathname === item.link
                    ? "4px solid #68B2A0"
                    : "4px solid transparent",
                backgroundColor:
                  location.pathname === item.link ? "#2C6975" : "transparent",
                fontWeight: location.pathname === item.link ? "bold" : "500",
                color: location.pathname === item.link ? "white" : "black",

                "&:hover": {
                  backgroundColor: "rgba(44, 105, 117, 0.2)",
                },
              }}
              onClick={isMobile ? toggleDrawer : null}
            >
              <ListItemIcon
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  minWidth: open ? "auto" : 56,
                  color: location.pathname === item.link ? "white" : "#2C6975",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {open && <p className="w-full">{item.text}</p>}
            </ListItem>
          ))}
        </List>
      </MiniDrawer>
    </>
  );
};

export default Sidebar;
