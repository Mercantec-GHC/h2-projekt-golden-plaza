import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FlareIcon from '@mui/icons-material/Flare';
import { KeycloakContext } from '../../App';

// Define the available pages for navigation
const pages = [
    { label: 'Contact', href: '/contact', requireLogin: false, requireNotLogin: false },
    { label: 'Signup', href: '/login', requireLogin: false, requireNotLogin: true },
    { label: 'Rooms', href: '/rooms', requireLogin: false, requireNotLogin: false },
    { label: 'Booking', href: '/manage-booking', requireLogin: true, requireNotLogin: false },
    { label: 'Tickets', href: '/ticket', requireLogin: true, requireNotLogin: false },
    { label: 'Login', href: '/login', requireLogin: false, requireNotLogin: true },
];

// Define user-specific settings in the dropdown menu
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// Main navigation bar component, responsible for rendering the app's navigation and user menu
function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { keycloak, init } = React.useContext(KeycloakContext);

    // Filter pages based on login requirements
    const filteredPages = pages.filter((page) => {
        if (page.requireLogin && !keycloak.authenticated) return false;
        if (page.requireNotLogin && keycloak.authenticated) return false;
        return true;
    });

    // Open the main navigation menu (mobile view)
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget); // Set the anchor element to open the menu
    };

    // Open the user settings menu
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget); // Set the anchor element to open the user menu
    };

    // Close the main navigation menu (mobile view)
    const handleCloseNavMenu = () => {
        setAnchorElNav(null); // Reset the anchor element to close the menu
    };

    // Close the user settings menu, with additional handling for the "Logout" option
    const handleCloseUserMenu = (setting) => {
        if (setting === 'Logout') {
            keycloak.logout(); // Log out using Keycloak if "Logout" is selected
        }
        setAnchorElUser(null); // Reset the anchor element to close the menu
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo icon displayed in larger viewports */}
                    <FlareIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'rgb(180 155 99)' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'rgb(180 155 99)',
                            textDecoration: 'none',
                        }}
                    >
                        GOLDEN PLAZA {/* Website title displayed in larger viewports */}
                    </Typography>

                    {/* Menu icon displayed in mobile view */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'rgb(180 155 99)' }}
                        >
                            <MenuIcon /> {/* Menu icon for opening the navigation menu */}
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav} // The anchor element for the menu
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)} // Toggle the menu open/close
                            onClose={handleCloseNavMenu} // Close menu when clicked
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {filteredPages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Typography
                                        sx={{ textAlign: 'center', color: 'rgb(180 155 99)' }}
                                        component="a"
                                        href={page.href} // Navigate to the page's URL
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {page.label} {/* Page label displayed in the menu */}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo icon and title displayed in mobile view */}
                    <FlareIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'rgb(180 155 99)' }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'rgb(180 155 99)',
                            textDecoration: 'none',
                        }}
                    >
                        GOLDEN PLAZA {/* Website title displayed in mobile view */}
                    </Typography>

                    {/* Navigation buttons displayed in larger viewports */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {filteredPages.map((page) => (
                            <Button
                                key={page.label}
                                href={page.href} // Navigate to the page's URL
                                onClick={handleCloseNavMenu} // Close the menu after navigation
                                sx={{ my: 2, color: 'rgb(180 155 99)', display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    {/* User avatar or login button depending on authentication status */}
                    <Box sx={{ flexGrow: 0 }}>
                        {!keycloak.authenticated ? (
                            // Show login button if not authenticated
                            <Tooltip title="Login">
                                <IconButton href="/login" sx={{ p: 0 }}>
                                    <Avatar sx={{ bgcolor: 'rgb(180 155 99)', color: 'black' }}>
                                        GP {/* Avatar with initials "GP" */}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            // Show user avatar and settings if authenticated
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar sx={{ bgcolor: 'rgb(180 155 99)', color: 'black' }}>
                                        {keycloak.tokenParsed.preferred_username.charAt(0)} {/* User's initial */}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Dropdown menu for user settings */}
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser} // Anchor for the user menu
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)} // Toggle the menu open/close
                            onClose={handleCloseUserMenu} // Close menu when clicked
                        >
                            {/* Render user settings menu items */}
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                    <Typography sx={{ textAlign: 'center', color: 'rgb(180 155 99)' }}>
                                        {setting} {/* Display the setting label */}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
