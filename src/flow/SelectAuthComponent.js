import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';

// api
import wrapper from '../api/wrapper';
import authKeyApi from '../api/authkey'

import { useSnackbar } from 'notistack';

const SelectAuthComponent = ({onSelectAuthKey}) => {

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [authKey, setAuthKey] = React.useState('No Authorization');
    const [authKeys, setAuthKeys] = useState([])
    const getAuthKeysApi = wrapper(authKeyApi.getAllAuthKeys);

    useEffect(() => {
        getAuthKeysApi.request();
    }, [])

    useEffect(() => {
        if (getAuthKeysApi.data) {
            const retrievedAuthKeys = getAuthKeysApi.data
            console.log('Got saved auth keys: ', retrievedAuthKeys);
            setAuthKeys(retrievedAuthKeys)
        } else if (getAuthKeysApi.error) {
            const error = getAuthKeysApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get saved authkeys: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get saved authkeys: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAuthKeysApi.data, getAuthKeysApi.error])

    // can potentially expose add new auth key link in the drop down menu here
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Select Auth Key</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={authKey}
                label="Select Auth Key"
                onChange={(e) => {
                    setAuthKey(e.target.value);
                    if (e.target.value == 'No Authorization') {
                        onSelectAuthKey(undefined)
                    } else {
                        onSelectAuthKey(e.target.value)
                    }
                }}
            >
                <MenuItem value={'No Authorization'}>
                    <em>No Authorization</em>
                </MenuItem>
                {authKeys.map((authKey, index) => (
                    <MenuItem value={authKey}>{authKey.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
                   
}

export default SelectAuthComponent