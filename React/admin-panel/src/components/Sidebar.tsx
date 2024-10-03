// src/components/Sidebar.tsx

// Here is all the imports that are needed for this component
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
import {
  Home,
  Hotel,
  Book,
  Menu,
  Login,
  ConfirmationNumber,
  Category,
  UploadFile,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { KeycloakContext } from "../App";
import Tickets from "../pages/Tickets";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  // navigate is a function that allows you to navigate to a different page
  const navigate = useNavigate();
  // theme is a variable that stores the current theme
  const theme = useTheme();
  // isMobile is a boolean that is true if the screen size is less than or equal to
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // mobileOpen is a boolean that is true if the mobile drawer is open
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // keycloak and init are variables that store the keycloak instance and the init function
  const { keycloak, init } = React.useContext(KeycloakContext);

  // handleDrawerToggle is a function that toggles the mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // handleLoginClick is a function that initializes the keycloak instance
  const handleLoginClick = () => {
    init();
  };

  // menuItems is an array of objects that store the text, icon, and path of each
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Rooms", icon: <Hotel />, path: "/roommanagement" },
    { text: "Room Types", icon: <Category />, path: "/roomtypes" },
    { text: "Tickets", icon: <ConfirmationNumber />, path: "/tickets" },
    { text: "Bookings", icon: <Book />, path: "/bookings" },
    { text: "Batch Import", icon: <UploadFile />, path: "/batch-import" },
    // Add more menu items as needed
  ];

  // drawerContent is a JSX element that contains the sidebar content
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {/* Maps through the menuItems array and creates a ListItemButton for each item */}
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
    {/* If the screen size is less than or equal to sm then it will show a drawer that can be toggled */}
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
        // If the screen size is greater than sm then it will show a permanent drawer
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
