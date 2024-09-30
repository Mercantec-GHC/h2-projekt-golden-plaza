// src/components/Sidebar.tsx

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
} from "@mui/material";
import { Home, Hotel, Book, Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Rooms", icon: <Hotel />, path: "/roommanagement" },
    { text: "Bookings", icon: <Book />, path: "/bookings" },
    // Add more menu items as needed
  ];

  const drawerContent = (
    <div>
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
    </div>
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
