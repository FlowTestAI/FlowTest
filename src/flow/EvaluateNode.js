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

const OperatorMenu = (data) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (op) => {
        data.opearator = op;
        setAnchorEl(null);
        setOperator(op);
    };

    const [opearator, setOperator] = React.useState(data.opearator ? data.opearator : 'Choose Operator')

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

const VariableTypeMenu = (data, vname) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (variabletype) => {
        if (!data[vname]) {
            data[vname] = {}
        }
        data[vname].type = variabletype;
        setAnchorEl(null);
        setVtype(variabletype);
    };

    const [vType, setVtype] = React.useState(data[vname] && data[vname].type ? data[vname].type : 'String')

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

    const [var1, setVar1] = React.useState(data["var1"] && data["var1"].value ? data["var1"].value : "");
    const [var2, setVar2] = React.useState(data["var2"] && data["var2"].value ? data["var2"].value : "");

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
                                    value={var1}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {VariableTypeMenu(data, "var1")}
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight'
                                    }}
                                    fullWidth
                                    size="small"
                                    className="nodrag"
                                    onChange={(e) => {
                                        if (!data["var1"]) {
                                            data["var1"] = {}
                                        }
                                        data["var1"].value = e.target.value;
                                        setVar1(e.target.value)
                                    }}
                                />
                                <FormHelperText id="outlined-weight-helper-text">var1</FormHelperText>
                            </div>
                        </Box>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            {OperatorMenu(data)}
                        </Box>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <div>
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    value={var2}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {VariableTypeMenu(data, "var2")}
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight',
                                    }}
                                    fullWidth
                                    size="small"
                                    className="nodrag"
                                    onChange={(e) => {
                                        if (!data["var2"]) {
                                            data["var2"] = {}
                                        }
                                        data["var2"].value = e.target.value;
                                        setVar2(e.target.value)
                                    }}
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