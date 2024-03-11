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
      <div className='absolute bottom-4 right-4 z-[2000] max-w-sm px-4 '>
        <Popover className='relative'>
          {({ open }) => (
            <>
              <Popover.Button className='inline-flex items-center p-3 text-base font-medium text-white rounded-full group bg-cyan-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                {open ? (
                  <MinusIcon className='w-8 h-8 transition duration-300 ease-in-out' aria-hidden='true' />
                ) : (
                  <PlusIcon className='w-8 h-8 transition duration-300 ease-in-out' aria-hidden='true' />
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
                <Popover.Panel className='absolute bottom-full w-screen max-w-sm translate-x-[-90%] transform rounded-lg bg-white shadow-2xl'>
                  <>
                    <div className='mx-auto max-h-[60vh] w-full max-w-md overflow-scroll rounded-2xl p-2'>
                      <h3 className='pb-4 text-lg font-semibold text-center text-gray-900 border-b border-neutral-300'>
                        Add Nodes
                      </h3>
                      {/* Requests */}
                      <Disclosure as='div' className='mt-4'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Requests</span>
                              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                            </Disclosure.Button>

                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              {requestNodes.map((node, index) => (
                                <div
                                  key={`${node.requestType}-${index}`}
                                  onDragStart={(event) => onDragStart(event, node)}
                                  draggable
                                  cursor='move'
                                  className='py-2 border-b'
                                >
                                  <div className='text-base font-semibold primary-text'>{node.requestType}</div>
                                  <div className='text-xs secondary-text'>{node.description}</div>
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
                              <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                                <span>{collection.name}</span>
                                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                              </Disclosure.Button>
                              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                                <div>
                                  {collection.nodes.map((node, index1) => (
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
                                      className='py-2 border-b'
                                    >
                                      <div className='text-base font-semibold primary-text'>{`${node.requestType} - ${node.operationId}`}</div>
                                      <div className='text-xs secondary-text'>{node.description}</div>
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
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Output</span>
                              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='output'
                                onDragStart={(event) => onDragStart(event, outputNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Output</div>
                                <div className='text-xs secondary-text'>{outputNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Evaluate */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Evaluate</span>
                              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='evaluate'
                                onDragStart={(event) => onDragStart(event, evaluateNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Evaluate</div>
                                <div className='text-xs secondary-text'>{evaluateNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Delay */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Delay</span>
                              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='delay'
                                onDragStart={(event) => onDragStart(event, delayNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Delay</div>
                                <div className='text-xs secondary-text'>{delayNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Authentication */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Authentication</span>
                              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='auth'
                                onDragStart={(event) => onDragStart(event, authNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Auth</div>
                                <div className='text-xs secondary-text'>{authNode.description}</div>
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
