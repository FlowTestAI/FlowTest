import { Card, Box, TextField, Typography, Divider } from "@mui/material"
import { grey } from "@mui/material/colors"
import { Handle, Position } from "reactflow"
import RequestBodyOptions from "./RequestBodyOptions"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

const RequestNode = ({data}) => {
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
                                <RequestBodyOptions/>
                            </div>
                        </Box>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        {/* <Typography
                            id="decorated-list-demo"
                            level="body-xs"
                            mb={1}
                            ml={1}
                            fontSize="default"
                        >
                            Body <RequestBodyOptions/>
                        </Typography> */}
                        <Box style={{ width: 300, margin: 10, padding: 5 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Json"
                                multiline
                                rows={4}
                                defaultValue="{}"
                                fullWidth
                                className="nodrag"
                            />
                        </Box>
                    </div>
                    <Divider />
                        <Box sx={{ background: grey[100], p: 1 }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    textAlign: 'center'
                                }}
                            >
                                Input Variables
                            </Typography>
                        </Box>
                    <Divider />
                    {/* <FormControl sx={{ m: 1 }} variant="outlined"> */}
                    <Box style={{ width: 300, margin: 10, padding: 5 }}>
                        <OutlinedInput
                            id="outlined-adornment-weight"
                            endAdornment={<InputAdornment position="end">{data.variables.uuid}</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                            'aria-label': 'weight',
                            }}
                            fullWidth
                            size="small"
                            className="nodrag"
                        />
                        <FormHelperText id="outlined-weight-helper-text">uuid</FormHelperText>
                    </Box>
                    {/* </FormControl> */}
                </Box>
            </Card>
            <Handle type="source" position={Position.Right} />
        </>
    )
}

export default RequestNode