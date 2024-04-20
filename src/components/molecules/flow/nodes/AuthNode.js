import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';

const AuthNode = ({ id, data }) => {
  const setAuthNodeType = useCanvasStore((state) => state.setAuthNodeType);
  const setBasicAuthValues = useCanvasStore((state) => state.setBasicAuthValues);

  const handleChange = (value, option) => {
    setBasicAuthValues(id, option, value);
  };

  const handleSelection = (event) => {
    setAuthNodeType(id, event.target?.value);
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
            value={data.type ? data.type : 'no-auth'}
            className='w-full rounded-lg border border-neutral-500 px-1 py-2 text-neutral-500 outline-0 focus:ring-0'
          >
            <option value='no-auth'>No Auth</option>
            <option value='basic-auth'>Basic Auth</option>
          </select>
        </div>
        {data.type === 'basic-auth' && (
          <div>
            <input
              type='text'
              placeholder='Username'
              value={data.username ? data.username : ''}
              className='nodrag nowheel  mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
              name='username'
              onChange={(e) => handleChange(e.target.value, 'username')}
            />
            <input
              type='text'
              placeholder='Password'
              value={data.password ? data.password : ''}
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

AuthNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AuthNode;
