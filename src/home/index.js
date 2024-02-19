import * as React from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';

// mui
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';

// icons
import CreateIcon from '@mui/icons-material/Create';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CollectionsIcon from '@mui/icons-material/Collections';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const drawerWidth = 240;

const HomeLayout = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = React.useState('');

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography
              variant='h6'
              noWrap
              component='div'
              onClick={() => navigate('/')}
              sx={{ '&:hover': { cursor: 'pointer' } }}
            >
              FlowTest
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem key='list' disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelected('saved_flows');
                    navigate('/flowtest');
                  }}
                  selected={selected === 'saved_flows'}
                >
                  <ListItemIcon>
                    <FolderSpecialIcon />
                  </ListItemIcon>
                  <ListItemText primary='Saved Flows' />
                </ListItemButton>
              </ListItem>
              <ListItem key='create' disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelected('create_flow');
                    navigate('/flow');
                  }}
                  selected={selected === 'create_flow'}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary='Create New Flow' />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem key='list_collection' disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelected('collection');
                    navigate('/collection');
                  }}
                  selected={selected === 'collection'}
                >
                  <ListItemIcon>
                    <CollectionsIcon />
                  </ListItemIcon>
                  <ListItemText primary='Collections' />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem key='list_auth_keys' disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelected('authkeys');
                    navigate('/authkeys');
                  }}
                  selected={selected === 'authkeys'}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary='Auth Keys' />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem key='flowtest_ai' disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelected('flowtest-ai');
                    navigate('/flowtest/ai');
                  }}
                  selected={selected === 'flowtest-ai'}
                >
                  <ListItemIcon>
                    <SmartToyIcon />
                  </ListItemIcon>
                  <ListItemText primary='FlowTest AI' />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        {/* main content */}

        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default HomeLayout;
