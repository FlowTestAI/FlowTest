import * as React from 'react';
import { Handle, Position } from 'reactflow';

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
  MenuItem,
  Switch,
} from '@mui/material';
import Operators from '../../constants/operators';

const OperatorMenu = (data) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (op) => {
    data.operator = op;
    setAnchorEl(null);
    setOperator(op);
  };

  const [operator, setOperator] = React.useState(data.operator ? data.operator : 'Choose Operator');

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {operator}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose(Operators.isLessThan)}>{Operators.isLessThan}</MenuItem>
        <MenuItem onClick={() => handleClose(Operators.isGreaterThan)}>{Operators.isGreaterThan}</MenuItem>
        <MenuItem onClick={() => handleClose(Operators.isEqualTo)}>{Operators.isEqualTo}</MenuItem>
        <MenuItem onClick={() => handleClose(Operators.isNotEqualTo)}>{Operators.isNotEqualTo}</MenuItem>
      </Menu>
    </div>
  );
};

const getInputType = (vType) => {
  if (vType == 'Number') {
    return 'number';
  } else {
    return 'text';
  }
};

const Variable = (data, vname) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (variabletype) => {
    if (!data.variables[vname]) {
      data.variables[vname] = {};
    }
    data.variables[vname].type = variabletype;
    switch (variabletype) {
      case 'String':
        data.variables[vname].value = '';
        setVar1('');
        break;
      case 'Select':
        data.variables[vname].value = '';
        setVar1('');
        break;
      case 'Number':
        data.variables[vname].value = 0;
        setVar1(0);
        break;
      case 'Boolean':
        data.variables[vname].value = false;
        setVar1(false);
        break;
    }
    setAnchorEl(null);
    setVtype(variabletype);
    setInputType(getInputType(variabletype));
  };

  const [vType, setVtype] = React.useState(
    data.variables[vname] && data.variables[vname].type ? data.variables[vname].type : 'String',
  );
  const [inputType, setInputType] = React.useState(
    getInputType(data.variables[vname] && data.variables[vname].type ? data.variables[vname].type : 'String'),
  );
  const [var1, setVar1] = React.useState(
    data.variables[vname] && data.variables[vname].value ? data.variables[vname].value : '',
  );

  // default value
  if (!data.variables[vname]) {
    data.variables[vname] = {};
    data.variables[vname].type = 'String';
    data.variables[vname].value = '';
  }

  return (
    <div>
      {vType === 'Boolean' ? (
        <TextField
          variant='outlined'
          label={var1.toString()}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Switch
                  checked={var1}
                  onChange={(e) => {
                    if (!data.variables[vname]) {
                      data.variables[vname] = {};
                    }
                    data.variables[vname].value = e.target.checked;
                    setVar1(e.target.checked);
                  }}
                  color='primary'
                  inputProps={{ 'aria-label': 'toggle switch' }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  id='basic-button'
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {vType}
                </Button>
                <Menu
                  id='basic-menu'
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
                  <MenuItem onClick={() => handleClose('Boolean')}>Boolean</MenuItem>
                </Menu>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <OutlinedInput
          type={inputType}
          id='outlined-adornment-weight'
          value={var1}
          endAdornment={
            <InputAdornment position='end'>
              <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {vType}
              </Button>
              <Menu
                id='basic-menu'
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
                <MenuItem onClick={() => handleClose('Boolean')}>Boolean</MenuItem>
              </Menu>
            </InputAdornment>
          }
          aria-describedby='outlined-weight-helper-text'
          inputProps={{
            'aria-label': 'weight',
          }}
          fullWidth
          size='small'
          className='nodrag'
          onChange={(e) => {
            if (!data.variables[vname]) {
              data.variables[vname] = {};
            }
            switch (vType) {
              case 'String':
                data.variables[vname].value = e.target.value.toString();
                setVar1(e.target.value.toString());
                break;
              case 'Select':
                data.variables[vname].value = e.target.value.toString();
                setVar1(e.target.value.toString());
                break;
              case 'Number':
                data.variables[vname].value = parseInt(e.target.value);
                setVar1(parseInt(e.target.value));
                break;
            }
          }}
        />
      )}

      <FormHelperText id='outlined-weight-helper-text'>{vname}</FormHelperText>
    </div>
  );
};

const EvaluateNode = ({ data }) => {
  if (data.variables == undefined) {
    data.variables = {};
  }

  return (
    <>
      <Handle type='target' position={Position.Left} />
      <Card
        sx={{
          border: 1,
          borderRadius: 2,
          ':hover': {
            borderColor: 'primary.main',
            boxShadow: 10, // theme.shadows[20]
          },
        }}
      >
        <Typography sx={{ fontWeight: 500, textAlign: 'center', marginLeft: 1 }} variant='h7'>
          Evaluate
        </Typography>
        <Box>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
            <Box style={{ width: 300, margin: 10, padding: 5 }}>{Variable(data, 'var1')}</Box>
            <Box style={{ width: 300, margin: 10, padding: 5 }}>{OperatorMenu(data)}</Box>
            <Box style={{ width: 300, margin: 10, padding: 5 }}>{Variable(data, 'var2')}</Box>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Box style={{ width: 300, margin: 10, padding: 5, textAlign: 'right' }}>True</Box>
            <Box style={{ width: 300, margin: 10, padding: 5, textAlign: 'right' }}>False</Box>
          </div>
        </Box>
      </Card>
      <Handle type='source' position={Position.Right} id='true' style={{ bottom: 50, top: 'auto' }} />
      <Handle type='source' position={Position.Right} id='false' style={{ bottom: 5, top: 'auto' }} />
    </>
  );
};

export default EvaluateNode;
