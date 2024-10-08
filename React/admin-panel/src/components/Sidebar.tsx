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

// Sidebar drawer width
const drawerWidth = 240;

// Sidebar functional component
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
    setMobileOpen(!mobileOpen); // Toggle the state between true/false to open/close
  };


  // handleLoginClick is a function that initializes the keycloak instance
  const handleLoginClick = () => {
    init(); 
  };


  // menuItems is an array of objects that store the text, icon, and path of each
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" }, // Navigate to home
    { text: "Rooms", icon: <Hotel />, path: "/roommanagement" }, // Navigate to room management
    { text: "Room Types", icon: <Category />, path: "/roomtypes" }, // Navigate to room types
    { text: "Tickets", icon: <ConfirmationNumber />, path: "/tickets" }, // Navigate to tickets
    { text: "Bookings", icon: <Book />, path: "/bookings" }, // Navigate to bookings
    { text: "Batch Import", icon: <UploadFile />, path: "/batch-import" }, // Navigate to batch import
    // Add more menu items as needed
  ];

  // drawerContent is a JSX element that contains the sidebar content
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar /> {/* Placeholder to account for the top toolbar */}
      <Divider /> {/* Divider to separate sections */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {/* Maps through the menuItems array and creates a ListItemButton for each item */}
          {menuItems.map((item) => (
            <ListItemButton
              component="nav" // HTML element for the list item button
              aria-labelledby="nested-list-subheader"
              key={item.text} // Unique key for each item
              onClick={() => navigate(item.path)} // Navigate to the defined path on click
            >
              <ListItemIcon>{item.icon}</ListItemIcon> {/* Display item icon */}
              <ListItemText primary={item.text} /> {/* Display item text */}
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider /> {/* Divider before the login/logout section */}
      <Box sx={{ p: 2 }}>
        {/* Show login button if not authenticated, otherwise show logout button */}
        {keycloak?.authenticated || false ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            fullWidth
            onClick={() => keycloak?.logout()} // Logout when clicked
          >
            {keycloak?.tokenParsed?.name || "Logged in"}{" "}
            {/* Display the user's name */}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            fullWidth
            onClick={handleLoginClick} // Trigger login when clicked
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
          {/* Menu button to open the sidebar in mobile view */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle} // Toggle the drawer
            sx={{ position: "fixed", top: 0, left: 0 }}
          >
            <Menu /> {/* Menu icon */}
          </IconButton>

          {/* Drawer component for mobile view, opens temporarily */}
          <Drawer
            variant="temporary" // Temporary drawer for mobile devices
            open={mobileOpen} // Open state controlled by mobileOpen state
            onClose={handleDrawerToggle} // Close the drawer when clicking outside
            ModalProps={{
              keepMounted: true, // Keeps mounted for better performance on mobile
            }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                boxSizing: "border-box",
                width: drawerWidth, // Set drawer width
              },
            }}
          >
            {drawerContent} {/* Render the sidebar content inside the drawer */}
          </Drawer>
        </>
      ) : (

        // If the screen size is greater than sm then it will show a permanent drawer
        <Drawer
          variant="permanent" // Permanent drawer for desktop devices
          sx={{
            width: drawerWidth, // Set drawer width
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth, // Set drawer paper width
              boxSizing: "border-box", // Box sizing to make it responsive
            },
          }}
        >
          {drawerContent} {/* Render the sidebar content inside the drawer */}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
