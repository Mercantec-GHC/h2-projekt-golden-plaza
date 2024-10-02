// src/components/Sidebar.tsx

import React from "react";
import {
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import { Home, Hotel, Book, Menu, Login, ConfirmationNumber } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { KeycloakContext } from "../App";
import Tickets from "../pages/Tickets";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { keycloak, init } = React.useContext(KeycloakContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    init();
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Rooms", icon: <Hotel />, path: "/roommanagement" },
    { text: "Bookings", icon: <Book />, path: "/bookings" },
    { text: "Tickets", icon: <ConfirmationNumber />, path: "/tickets" },
    // Add more menu items as needed
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              component="nav"
              aria-labelledby="nested-list-subheader"
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {/* If not logged in shows a login button but if logged in will just show user name */}
        {keycloak?.authenticated || false ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            fullWidth
            onClick={() => keycloak?.logout()}
          >
            {keycloak?.tokenParsed?.name || "Logged in"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            fullWidth
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ position: "fixed", top: 0, left: 0 }}
          >
            <Menu />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
