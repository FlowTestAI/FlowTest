import * as React from 'react';
import { Handle, Position } from "reactflow"

// mui
import { 
    Box, 
    TextField,
    Card,
    Typography,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    Button,
    Menu,
    MenuItem
} from "@mui/material"

const OperatorMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (op) => {
        setAnchorEl(null);
        setOperator(op);
    };

    const [opearator, setOperator] = React.useState('Choose Operator')

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {opearator}
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
                <MenuItem onClick={() => handleClose('isLessThan')}>isLessThan</MenuItem>
                <MenuItem onClick={() => handleClose('isGreaterThan')}>isGreaterThan</MenuItem>
                <MenuItem onClick={() => handleClose('isEqualTo')}>isEqualTo</MenuItem>
                <MenuItem onClick={() => handleClose('isNotEqualTo')}>isNotEqualTo</MenuItem>
            </Menu>
        </div>
    )
}

const VariableTypeMenu = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (variabletype) => {
        setAnchorEl(null);
        setVtype(variabletype);
    };

    const [vType, setVtype] = React.useState('String')

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {vType}
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
                <MenuItem onClick={() => handleClose('String')}>String</MenuItem>
                <MenuItem onClick={() => handleClose('Select')}>Select</MenuItem>
                <MenuItem onClick={() => handleClose('Number')}>Number</MenuItem>
                <MenuItem onClick={() => handleClose('Bool')}>Bool</MenuItem>
            </Menu>
        </div>
    )
}

const EvaluateNode = ({data}) => {

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
                <Typography sx={{fontWeight: 500, textAlign: 'center', marginLeft: 1}} variant='h7'>Evaluate</Typography>
                <Box>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <div>
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    value=""
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {VariableTypeMenu()}
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight'
                                    }}
                                    fullWidth
                                    size="small"
                                    className="nodrag"
                                    // onChange={(e) => handleVariableChange(e, id)}
                                />
                                <FormHelperText id="outlined-weight-helper-text">var1</FormHelperText>
                            </div>
                        </Box>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            {OperatorMenu()}
                        </Box>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <div>
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    value=""
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {VariableTypeMenu()}
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight',
                                    }}
                                    fullWidth
                                    size="small"
                                    className="nodrag"
                                    // onChange={(e) => handleVariableChange(e, id)}
                                />
                                <FormHelperText id="outlined-weight-helper-text">var2</FormHelperText>
                            </div>
                        </Box>
                    </div>
                </Box>
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    );
};

export default EvaluateNode;