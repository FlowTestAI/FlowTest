import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Popover, Transition } from '@headlessui/react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import useCollectionStore from 'stores/CollectionStore';
import { orderNodesByTags } from './utils';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
import requestNodes from './constants/requestNodes';

const outputNode = {
  description: 'Displays any data received.',
  type: 'outputNode',
};

const assertNode = {
  description: 'Assert on conditional expressions.',
  type: 'assertNode',
};

const delayNode = {
  description: 'Add a certain delay before next computation.',
  type: 'delayNode',
};

const authNode = {
  description: 'Define authentication for the requests',
  type: 'authNode',
};

const complexNode = {
  description: 'Helps to create nested flows',
  type: 'complexNode',
};

const setVarNode = {
  description: 'Assign a value to a variable',
  type: 'setVarNode',
};

const AddNodes = ({ collectionId }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Get all requests of this collections
  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  const nodesByTags = orderNodesByTags(collection.nodes, searchFilter);

  return (
    <div className='absolute bottom-4 right-4 z-[2000]'>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button className='group inline-flex items-center rounded border-cyan-900 bg-cyan-900 px-4 py-2.5 text-base font-medium text-white hover:border-cyan-950 hover:bg-cyan-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
              {open ? (
                <MinusIcon className='w-6 h-6 transition duration-300 ease-in-out' aria-hidden='true' />
              ) : (
                <PlusIcon className='w-6 h-6 transition duration-300 ease-in-out' aria-hidden='true' />
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
                    <h3 className='py-4 text-lg font-semibold text-center border-b '>Add Nodes</h3>
                    <HorizontalDivider />
                    <div className='py-4'>
                      {/* Requests */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Requests</span>
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
                                <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                              </Disclosure.Button>
                              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                                <div>
                                  <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
                                    <input
                                      type='text'
                                      className='nodrag nowheel block h-9 w-full min-w-40 rounded-bl-md rounded-tl-md p-2.5'
                                      name='search-nodes'
                                      placeholder='Search Nodes'
                                      onChange={(e) => setSearchFilter(e.target.value)}
                                      value={searchFilter}
                                    />
                                  </div>
                                  <HorizontalDivider />
                                  {Object.entries(nodesByTags).map(([tag, nodes], index) => (
                                    <Disclosure as='div' key={index}>
                                      {({ open }) => (
                                        <>
                                          <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                                            <span>{tag}</span>
                                            <ChevronDownIcon
                                              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                                            />
                                          </Disclosure.Button>
                                          <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                                            <div>
                                              {nodes.map((node) => (
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
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
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
                      {/* Assert */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Assert</span>
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='assert'
                                onDragStart={(event) => onDragStart(event, assertNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Assert</div>
                                <div className='text-xs secondary-text'>{assertNode.description}</div>
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
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
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
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
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
                      {/* Complex */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Complex</span>
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='complex'
                                onDragStart={(event) => onDragStart(event, complexNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Complex</div>
                                <div className='text-xs secondary-text'>{complexNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Set Variable */}
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-lg font-medium text-left border-t border-b bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring'>
                              <span>Set Variable</span>
                              <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm border-l border-r'>
                              <div
                                key='complex'
                                onDragStart={(event) => onDragStart(event, setVarNode)}
                                draggable
                                cursor='move'
                                className='py-2 border-b'
                              >
                                <div className='text-base font-semibold primary-text'>Set Variable</div>
                                <div className='text-xs secondary-text'>{setVarNode.description}</div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  </div>
                </>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

AddNodes.propTypes = {
  collectionId: PropTypes.string.isRequired,
};

export default AddNodes;
