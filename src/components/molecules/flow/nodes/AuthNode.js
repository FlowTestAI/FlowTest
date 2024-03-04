import * as React from 'react';
import FlowNode from 'components/atoms/flow/FlowNode';

const AuthNode = ({ data }) => {
  /* its better to have no space strings as values since they are less error/bug prone */
  const initState = () => {
    if (data.auth && data.auth.type) {
      return data.auth.type; // should return basic-auth
    } else {
      data.auth = {};
      data.auth.type = 'no-auth';
      return 'no-auth';
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [auth, setAuth] = React.useState(initState());

  /**
   * Not sure whether you need to set the value for data props/param or not.
   * Technically you should not set the value for a prop/param in a component
   * Check this and other places in this file once
   */
  const handleChange = (value, option) => {
    data.auth[option] = value;
  };

  const handleSelection = (event) => {
    const selectedValue = event.target?.value;
    setAuth(selectedValue);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (authOption) => {
    setAuth(authOption);
    data.auth = {};
    data.auth.type = authOption;
    setAnchorEl(null);
  };

  return (
    <>
      <FlowNode
        title='Authentication'
        handleLeft={true}
        handleLeftData={{ type: 'target' }}
        handleRight={true}
        handleRightData={{ type: 'source' }}
      >
        {/* Content of the flow Node */}
        <div className='tw-mb-2'>
          <select
            onChange={handleSelection}
            name='auth-type'
            default={auth}
            className='tw-w-full tw-rounded-lg tw-border tw-border-neutral-500 tw-px-1 tw-py-2 tw-text-neutral-500 tw-outline-0 focus:tw-ring-0'
          >
            <option value='no-auth'>No Auth</option>
            <option value='basic-auth'>Basic Auth</option>
          </select>
        </div>
        {auth === 'basic-auth' && (
          <div>
            <input
              type='text'
              placeholder={data.auth.username ? data.auth.username : 'Username'}
              className='nodrag nowheel  tw-mb-2 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-sm tw-text-gray-900 tw-outline-blue-300 focus:tw-border-blue-100 focus:tw-ring-blue-100'
              name='username'
            />
            <input
              type='password'
              placeholder={data.auth.password ? data.auth.password : 'Password'}
              className='nodrag nowheel tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-sm tw-text-gray-900 tw-outline-blue-300 focus:tw-border-blue-100 focus:tw-ring-blue-100'
              name='password'
            />
          </div>
        )}
      </FlowNode>
    </>
  );
};

export default AuthNode;
