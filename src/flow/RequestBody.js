import * as React from 'react';

// mui
import { Box, TextField, MenuItem, Menu, IconButton, Divider, Typography } from "@mui/material"

import { grey } from "@mui/material/colors"

import MoreVertIcon from '@mui/icons-material/MoreVert';

const requestBodyTypeOptions = [
    'None',
    'form-data',
    'raw-json',
    'raw-txt',
];

const ITEM_HEIGHT = 48;

const RequestBody = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [bodyType, setBodyType] = React.useState('None')
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setBodyType(option)
    setAnchorEl(null);
  };

  return (
      <>
        <Divider />
        <Box sx={{ background: grey[100], p: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    sx={{
                        fontWeight: 500,
                        textAlign: 'center'
                    }}
                >
                        Body 
                </Typography>
                <div>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                        'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                        }}
                    >
                        {requestBodyTypeOptions.map((bodyTypeOption) => (
                            <MenuItem key={bodyTypeOption} onClick={() => handleClose(bodyTypeOption)}>
                                {bodyTypeOption}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>
        </Box>
        <Divider />
        {bodyType != 'None' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                <Box style={{ width: 300, margin: 10, padding: 5 }}>
                    <TextField
                        id="outlined-multiline-static"
                        label={bodyType}
                        multiline
                        rows={4}
                        defaultValue="{}"
                        fullWidth
                        className="nodrag"
                    />
                </Box>
            </div>
        )
        }
    </>
  );
}

export default RequestBody
