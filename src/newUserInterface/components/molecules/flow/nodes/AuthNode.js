import * as React from 'react';
import { Handle, Position } from "reactflow"

// mui
import { 
    Box, 
    Button,
    Menu,
    MenuItem,
    Card,
    Typography,
    TextField
} from "@mui/material"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AuthNode = ({data}) => {

    const initState = () => {
        if (data.auth && data.auth.type) {
            return data.auth.type;
        } else {
            data.auth = {}
            data.auth.type = "No Auth";
            return "No Auth"
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [auth, setAuth] = React.useState(initState())

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (authOption) => {
        setAuth(authOption);
        data.auth = {}
        data.auth.type = authOption;
        setAnchorEl(null);
    };

    const handleChange = (value, option) => {
        data.auth[option] = value
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Card 
                sx={{ 
                    border: 1,  
                    borderRadius: 2,
                    ':hover': {
                        borderColor: 'primary.main',
                        boxShadow: 10, // theme.shadows[20]
                    }  
                }}
            >
                <Typography sx={{fontWeight: 500, textAlign: 'center', marginLeft: 1}} variant='h7'>Authentication</Typography>
                <Box>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                endIcon={<KeyboardArrowDownIcon />}
                            >
                                {auth}
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => handleClose("No Auth")}>No Auth</MenuItem>
                                <MenuItem onClick={() => handleClose("Basic Auth")}>Basic Auth</MenuItem>
                            </Menu>
                            {auth === "Basic Auth" && (
                                <Box
                                    component="form"
                                    sx={{
                                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        defaultValue={data.auth.Username ? data.auth.Username : ""} 
                                        id="outlined-basic" 
                                        label="Username" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth
                                        className="nodrag nowheel"
                                        onChange={(e) => handleChange(e.target.value, "Username")} 
                                    />
                                    <TextField 
                                        defaultValue={data.auth.Password ? data.auth.Password : ""} 
                                        id="outlined-basic" 
                                        label="Password" 
                                        variant="outlined" 
                                        size="small" 
                                        fullWidth
                                        className="nodrag nowheel"
                                        onChange={(e) => handleChange(e.target.value, "Password")}  
                                    />
                                </Box>
                            )}
                        </Box>
                    </div>
                </Box>
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    );
};

export default AuthNode;