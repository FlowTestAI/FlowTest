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
    data.auth = {};
    data.auth.type = selectedValue;
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
        <div className='mb-2'>
          <select
            onChange={handleSelection}
            name='auth-type'
            value={auth}
            className='w-full px-1 py-2 border rounded-lg border-neutral-500 text-neutral-500 outline-0 focus:ring-0'
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
              className='nodrag nowheel  mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
              name='username'
              onChange={(e) => handleChange(e.target.value, 'username')}
            />
            <input
              type='password'
              placeholder={data.auth.password ? data.auth.password : 'Password'}
              className='nodrag nowheel block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
              name='password'
              onChange={(e) => handleChange(e.target.value, 'password')}
            />
          </div>
        )}
      </FlowNode>
    </>
  );
};

export default AuthNode;
