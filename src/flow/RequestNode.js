import { Card, Box, TextField, Typography, Divider, IconButton } from "@mui/material"
import { grey } from "@mui/material/colors"
import { Handle, Position } from "reactflow"

import RequestBody from "./RequestBody";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

import DeleteIcon from '@mui/icons-material/Delete';

import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import VariableDialog from "./VariableDialog";

function initialVariables (data) {
    if (data.variables != undefined) {
        return data.variables
    }
    return {};
}

const RequestNode = ({data}) => {
    
    const [variableDialogOpen, setVariableDialogOpen] = useState(false)
    const [variables, setVariables] = useState(initialVariables(data));

    // only supporting string type variables for now
    const handleAddVariable = (name, type) => {
        const newId = name
        const newVar = {
            type: type,
            value: ''
        }
        setVariables((prevVariables) => {
            return { ...prevVariables, [newId]: newVar}
        });
    }

    const handleDeleteVariable = (event, id) => {
        setVariables((currentVariables) => {
            const { [id]: _, ...newVariables } = currentVariables;
            return newVariables;
        });
    }

    const handleVariableChange = (event, id) => {
        setVariables((currentVariables) => {
            const updateVar = {
                type: currentVariables[id].type,
                value: event.target.value
            }
            return {...currentVariables, [id]: updateVar};
        });
    }

    useEffect(() => {
        data.variables = variables
    }, [variables])

    const handleURLChange = (e) => {
        data.url = e.target.value
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
                <Box>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <TextField
                                label={data.requestType}
                                defaultValue={data.url ? data.url : ''}
                                id="outlined-size-small"
                                helperText="Enter URL"
                                size="small"
                                className="nodrag nowheel"
                                fullWidth
                                onChange={(e) => handleURLChange(e)}
                                inputProps={{style: {fontSize: 12}}}
                            />
                        </Box>
                    </div>
                    <RequestBody nodeData={data}/>
                    <Divider />
                    <Box sx={{ background: grey[100], p: 1 }}>
                        <Typography
                            sx={{
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            Variables
                        </Typography>
                    </Box>
                    <Divider />
                    <Box style={{ width: 300, margin: 10, padding: 5 }}>
                        <IconButton onClick={() => setVariableDialogOpen(true)}>
                            <IconPlus/>
                        </IconButton>
                        {Object.keys(variables).map((id) => (
                            <>
                                <div style={{display:'flex', flexDirection:'row'}}>
                                    <div>
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            value={variables[id].value}
                                            endAdornment={<InputAdornment position="end">{variables[id].type}</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                            'aria-label': 'weight',
                                            }}
                                            fullWidth
                                            size="small"
                                            className="nodrag"
                                            onChange={(e) => handleVariableChange(e, id)}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">{id}</FormHelperText>
                                    </div>
                                    <IconButton onClick={(e) => handleDeleteVariable(e, id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </>
                        ))}
                    </Box>
                </Box>
                <VariableDialog show={variableDialogOpen} onCancel={() => setVariableDialogOpen(false)} onVariableAdd={handleAddVariable} />
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    )
}

export default RequestNode