import * as React from 'react';
import { useState } from 'react';

// MUI
import {
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Stack, 
    Box, 
    OutlinedInput, 
    Typography,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';

import { useSnackbar } from 'notistack';

// icons
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

const variableTypes = [
    {
      value: 'String',
      label: 'String',
    },
    {
      value: 'Select',
      label: 'Select',
    }
  ];

const VariableDialog = ({ show, onCancel, onVariableAdd }) => {

    const [variableName, setVariableName] = useState('')
    const [variableType, setVariableType] = useState('String')

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Name</Typography>
                        </Stack>
                        <OutlinedInput
                            id='keyName'
                            type='string'
                            fullWidth
                            placeholder='Enter variable name'
                            value={variableName}
                            name='keyName'
                            onChange={(e) => setVariableName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Type</Typography>
                        </Stack>
                        <TextField
                            id="filled-select-currency"
                            select
                            label=""
                            defaultValue="String"
                            helperText="Please select variable type"
                            variant="filled"
                            >
                            {variableTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value} onClick={() => setVariableType(option.value)}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Stack flexDirection='row'>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button 
                            variant='contained' 
                            sx={{ color: 'white', mr: 1, height: 37, marginBottom: 1 }} 
                            onClick={() => {
                                if (variableName.trim() != '') {
                                    onVariableAdd(variableName, variableType)
                                }
                                onCancel()
                            }} 
                            startIcon={<IconPlus />}
                        >
                            Add Variable
                        </Button>
                    </Stack>
                </DialogActions>
            </>
      </Dialog>
    ) : null

    return component;
}

export default VariableDialog