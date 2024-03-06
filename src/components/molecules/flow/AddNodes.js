import React, { useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import useCollectionStore from 'stores/CollectionStore';

// ToDo: Move these constants to constants file/folder
const requestNodes = [
  {
    requestType: 'GET',
    description: 'GET is used to request data from a specified resource.',
    type: 'requestNode',
  },
  {
    requestType: 'POST',
    description: 'POST is used to send data to a server to create/update a resource.',
    type: 'requestNode',
  },
  {
    requestType: 'PUT',
    description: 'PUT is used to send data to a server to create/update a resource. PUT requests are idempotent.',
    type: 'requestNode',
  },
  {
    requestType: 'DELETE',
    description: 'The DELETE method deletes the specified resource.',
    type: 'requestNode',
  },
];

const outputNode = {
  description: 'Displays any data received.',
  type: 'outputNode',
};

const evaluateNode = {
  description: 'Evaluate conditional expressions.',
  type: 'evaluateNode',
};

const delayNode = {
  description: 'Add a certain delay before next computation.',
  type: 'delayNode',
};

const authNode = {
  description: 'Define authentication for the requests',
  type: 'authNode',
};

const AddNodes = ({ collectionId }) => {
  // const [open, setOpen] = useState(false);
  // const anchorRef = useRef(null);
  // const ps = useRef();

  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Get all requests of this collections
  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  return (
    <>
      <div className='tw-absolute tw-bottom-4 tw-right-4 tw-z-[2000] tw-max-w-sm tw-px-4 '>
        <Popover className='tw-relative'>
          {({ open }) => (
            <>
              <Popover.Button className='tw-group tw-inline-flex tw-items-center tw-rounded-full tw-bg-orange-700 tw-p-3 tw-text-base tw-font-medium tw-text-white hover:tw-text-white focus:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-white/75'>
                {open ? (
                  <MinusIcon
                    className='tw-h-8 tw-w-8 tw-transition tw-duration-300 tw-ease-in-out'
                    aria-hidden='true'
                  />
                ) : (
                  <PlusIcon className='tw-h-8 tw-w-8 tw-transition tw-duration-300 tw-ease-in-out' aria-hidden='true' />
                )}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='tw-absolute tw-bottom-full tw-w-screen tw-max-w-sm tw-translate-x-[-90%] tw-transform tw-rounded-lg tw-bg-white tw-shadow-2xl'>
                  <>
                    <div className='tw-mx-auto tw-max-h-[60vh] tw-w-full tw-max-w-md tw-overflow-scroll tw-rounded-2xl tw-p-2'>
                      <h3 className='tw-border-[rgba(128, 128, 128, 0.35)] tw-border-b tw-pb-4 tw-text-center tw-text-lg tw-font-semibold tw-text-gray-900'>
                        Add Nodes
                      </h3>
                      {/* Requests */}
                      <Disclosure as='div' className='tw-mt-4'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                              <span>Requests</span>
                              <ChevronUpIcon className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5`} />
                            </Disclosure.Button>

                            <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                              {requestNodes.map((node, index) => (
                                <div
                                  key={`${node.requestType}-${index}`}
                                  onDragStart={(event) => onDragStart(event, node)}
                                  draggable
                                  cursor='move'
                                  className='tw-border-b tw-py-2'
                                >
                                  <div className='primary-text tw-text-base tw-font-semibold'>{node.requestType}</div>
                                  <div className='secondary-text tw-text-xs'>{node.description}</div>
                                </div>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Saved Collections */}
                      {collection && (
                        <Disclosure as='div' key='collection.id'>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                                <span>{collection.name}</span>
                                <ChevronUpIcon
                                  className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5 `}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                                <div>
                                  {JSON.parse(collection.nodes).map((node, index1) => (
                                    <div
                                      key={`${node.requestType} - ${node.operationId}`}
                                      onDragStart={(event) => {
                                        const newNode = {
                                          ...node,
                                          type: 'requestNode',
                                        };
                                        onDragStart(event, newNode);
                                      }}
                                      draggable
                                      cursor='move'
                                      className='tw-border-b tw-py-2'
                                    >
                                      <div className='primary-text tw-text-base tw-font-semibold'>{`${node.requestType} - ${node.operationId}`}</div>
                                      <div className='secondary-text tw-text-xs'>{node.description}</div>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                      {/* Output */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                              <span>Output</span>
                              <ChevronUpIcon className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                              <div
                                key='output'
                                onDragStart={(event) => onDragStart(event, outputNode)}
                                draggable
                                cursor='move'
                                className='tw-border-b tw-py-2'
                              >
                                <div className='primary-text tw-text-base tw-font-semibold'>Output</div>
                                <div className='secondary-text tw-text-xs'>{outputNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Evaluate */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                              <span>Evaluate</span>
                              <ChevronUpIcon className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                              <div
                                key='evaluate'
                                onDragStart={(event) => onDragStart(event, evaluateNode)}
                                draggable
                                cursor='move'
                                className='tw-border-b tw-py-2'
                              >
                                <div className='primary-text tw-text-base tw-font-semibold'>Evaluate</div>
                                <div className='secondary-text tw-text-xs'>{evaluateNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Delay */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                              <span>Delay</span>
                              <ChevronUpIcon className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                              <div
                                key='delay'
                                onDragStart={(event) => onDragStart(event, delayNode)}
                                draggable
                                cursor='move'
                                className='tw-border-b tw-py-2'
                              >
                                <div className='primary-text tw-text-base tw-font-semibold'>Delay</div>
                                <div className='secondary-text tw-text-xs'>{delayNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Authentication */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='tw-flex tw-w-full tw-justify-between tw-border-b tw-border-t tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-left tw-text-lg tw-font-medium hover:tw-bg-gray-100 focus:tw-outline-none focus-visible:tw-ring'>
                              <span>Authentication</span>
                              <ChevronUpIcon className={`${open ? 'tw-rotate-180 tw-transform' : ''} tw-h-5 tw-w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='tw-border-l tw-border-r tw-px-4 tw-pb-2 tw-pt-4 tw-text-sm'>
                              <div
                                key='auth'
                                onDragStart={(event) => onDragStart(event, authNode)}
                                draggable
                                cursor='move'
                                className='tw-border-b tw-py-2'
                              >
                                <div className='primary-text tw-text-base tw-font-semibold'>Auth</div>
                                <div className='secondary-text tw-text-xs'>{authNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  </>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  );
};

export default AddNodes;
