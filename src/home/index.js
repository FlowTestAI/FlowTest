import * as React from 'react';
import { Outlet } from "react-router";
import { useNavigate } from 'react-router-dom'

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText,
    Divider 
 } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

const HomeLayout = () => {

    const navigate = useNavigate()
    const [drawer, setDrawer] = React.useState(false)

    // Side menu
    const sideMenu = () => {
        return (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawer(false)}
            onKeyDown={() => setDrawer(false)}
        >
            <List>
                <ListItem key="FlowTest" disablePadding>
                <ListItemButton>
                    {/* <ListItemText primary="FlowTest" /> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FlowTest
                    </Typography>
                </ListItemButton>
                </ListItem>
                <Divider/>
                <ListItem key="list" disablePadding>
                <ListItemButton>
                    <ListItemText primary='Saved Flows' />
                </ListItemButton>
                </ListItem>
                <ListItem key="create" disablePadding>
                <ListItemButton onClick={() => navigate('/flow')}>
                    <ListItemText primary='Create New Flow' />
                </ListItemButton>
                </ListItem>
            </List>
        </Box>
        );
    }

    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    open={drawer}
                    onClose={() => setDrawer(false)}
                >
                {sideMenu()}
                </Drawer>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FlowTest
                </Typography>
                <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Outlet/>
        </Box>
        </>
    );
}

export default HomeLayout;