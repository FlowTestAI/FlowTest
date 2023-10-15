import * as React from 'react';
import { Outlet } from "react-router";
import { useNavigate } from 'react-router-dom'

// mui
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
    ListItemIcon,
    Divider 
} from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';

// icons
import CreateIcon from '@mui/icons-material/Create';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CollectionsIcon from '@mui/icons-material/Collections';
import SecurityIcon from '@mui/icons-material/Security';

const drawerWidth = 240;

const HomeLayout = () => {

    const navigate = useNavigate()

    return (
        <>
         <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                <Typography variant="h6" noWrap component="div" onClick={() => navigate('/')} sx={{ "&:hover": { cursor: 'pointer' } }}>
                    FlowTest
                </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem key="list" disablePadding>
                        <ListItemButton onClick={() => navigate('/flowtest')}>
                            <ListItemIcon>
                                <FolderSpecialIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Saved Flows' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="create" disablePadding>
                        <ListItemButton onClick={() => navigate('/flow')}>
                            <ListItemIcon>
                                <CreateIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Create New Flow' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key="list" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <CollectionsIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Collections' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key="list" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SecurityIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Auth Keys' />
                        </ListItemButton>
                    </ListItem>
                </List>
                </Box>
            </Drawer>
            {/* main content */}
            
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
         </Box>
        </>
    );
}

export default HomeLayout;