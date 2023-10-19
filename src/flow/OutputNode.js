import * as React from 'react';
import { Handle, Position } from "reactflow"

// mui
import { 
    Box, 
    TextField,
    Card,
    Typography
} from "@mui/material"

const OutputNode = ({data}) => {
    const [output, setOutput] = React.useState(undefined)

    data.setOutput = setOutput

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
                <Typography sx={{fontWeight: 500, textAlign: 'center', marginLeft: 1}} variant='h7'>Output</Typography>
                <Box>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <TextField
                                label="json"
                                id="outlined-multiline-static"
                                multiline
                                rows={10}
                                value={output == undefined ? 'Run flow to see data' : JSON.stringify(output)}
                                fullWidth
                                className="nodrag nowheel"
                                inputProps={{style: {fontSize: 12}}}
                            />
                        </Box>
                    </div>
                </Box>
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    );
};

export default OutputNode;