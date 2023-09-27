import { Card, Box, TextField, Typography, Divider, IconButton } from "@mui/material"
import { grey } from "@mui/material/colors"
import { Handle, Position } from "reactflow"

import RequestBody from "./RequestBody";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

import DeleteIcon from '@mui/icons-material/Delete';

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

const RequestNode = ({data}) => {
    
    const [variables, setVariables] = useState([]);

    // only supporting string type variables for now
    const handleAddVariable = () => {
        const newVar = {
            id: variables.length + 1,
            name: 'var'+ (variables.length + 1),
            type: 'String'
        }
        setVariables((prevVariables) => [...prevVariables, newVar]);
    }

    const handleDeleteVariable = (event, id) => {
        setVariables(variables => {
          for (let i = id - 1; i < variables.length; i++) {
            variables[i].id--;
          }
        });
    
        setVariables((prevVariables) => {
          return [
            ...variables.slice(0, id - 1),
            ...variables.slice(id),
          ];
        });
    }

    const handleVariableChange = (event, variable) => {
        const varId = variable.id
        if (!data["variable"]) {
            data["variable"] = {}
        }
        if (!data["variable"][varId]) {
            data["variable"][varId] = {}
        }
        data.variable[varId].name = variable.name
        data.variable[varId].type = variable.type
        data.variable[varId].value = event.target.value
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Card sx={{ border: 1, borderColor: 'primary.main', borderRadius: 2 }}>
                <Box>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <TextField
                                label={data.requestType}
                                id="outlined-size-small"
                                helperText="Enter URL"
                                size="small"
                                className="nodrag"
                                fullWidth
                            />
                        </Box>
                    </div>
                    <RequestBody/>
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
                        <IconButton onClick={() => handleAddVariable()}>
                            <IconPlus/>
                        </IconButton>
                        {variables.map((variable, index) => (
                            <>
                                <div style={{display:'flex', flexDirection:'row'}}>
                                    <div>
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            endAdornment={<InputAdornment position="end">{variable.type}</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                            'aria-label': 'weight',
                                            }}
                                            fullWidth
                                            size="small"
                                            className="nodrag"
                                            onChange={(e) => handleVariableChange(e, variable)}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">{variable.name}</FormHelperText>
                                    </div>
                                    <IconButton onClick={(e) => handleDeleteVariable(e, variable.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </>
                        ))}
                    </Box>
                </Box>
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    )
}

export default RequestNode