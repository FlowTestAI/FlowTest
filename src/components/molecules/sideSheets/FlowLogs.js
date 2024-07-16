import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  BarsArrowUpIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { JsonView, collapseAllNested, defaultStyles } from 'react-json-view-lite';
import { LogLevel } from '../flow/graph/GraphLogger';
import { ClockIcon } from '@heroicons/react/20/solid';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
import SettingsModal from '../modals/SettingsModal';
import { formatTimeStamp } from 'utils/common';

const FlowLogs = ({ logsData }) => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const renderFlowScan = (flowScan) => {
    if (flowScan.upload === 'disabled') {
      return (
        <div className='my-2 w-full rounded border border-sky-600 bg-sky-50 p-4 text-sky-600'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex w-full items-center justify-start gap-4'>
              <BarsArrowUpIcon className='h-7 w-7' />
              <div className='w-full'>
                <div className='flex items-center justify-start gap-2 text-lg font-semibold'>
                  <h2> {flowScan?.message} </h2>
                </div>
              </div>
            </div>
            <Button
              btnType={BUTTON_TYPES.secondary}
              intentType={BUTTON_INTENT_TYPES.info}
              isDisabled={false}
              onClickHandle={() => setOpenSettingsModal(true)}
            >
              Activate Scans
            </Button>
            <SettingsModal closeFn={() => setOpenSettingsModal(false)} open={openSettingsModal} initialTab={0} />
          </div>
        </div>
      );
    } else if (flowScan.upload === 'success') {
      return (
        <div className='my-2 w-full rounded border border-green-600 bg-green-50 p-4 text-green-600'>
          <div className='flex w-full items-center justify-start gap-4'>
            <ShieldCheckIcon className='h-7 w-7' />
            <div className='w-full'>
              <div className='mb-4 flex items-center justify-start gap-2 text-lg font-semibold'>
                <h2>Successfully published the scan</h2>
              </div>
              <HorizontalDivider themeColor={'bg-green-600'} />
              <p className='font pb-2 pt-4'>
                <span className='font-semibold'>URL: </span>
                <a href={flowScan.url} target='_blank' rel='noreferrer' className='hover:underline'>
                  {flowScan.url}
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    } else if (flowScan.upload === 'fail') {
      return (
        <div className='my-2 flex w-full items-center gap-4 rounded border border-amber-600 bg-amber-50 p-4 text-amber-600'>
          <div className='flex items-center'>
            <ExclamationTriangleIcon className='h-7 w-7' />
          </div>
          <div className='w-full'>
            <div
              className={`flex items-center justify-start gap-2 text-lg font-semibold ${flowScan?.reason ? 'mb-4' : 'mb-0'}`}
            >
              <h2> {flowScan.message} </h2>
            </div>
            {flowScan?.reason ? (
              <>
                <HorizontalDivider themeColor={'bg-amber-600'} />
                <p className='pb-2 pt-4'>{flowScan?.reason}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className='overflow-auto'>
      <div>{renderFlowScan(logsData.run.scan)}</div>
      <div className='mt-4 flex flex-col rounded-md border-2 border-slate-300 bg-background-light text-cyan-900 shadow-sm'>
        <h2 className='border-b-2 border-slate-300 px-4 py-2 text-2xl font-medium'>
          <div className='flex flex-row'>
            Logs
            {logsData.run.status === 'Success' ? (
              <CheckCircleIcon className='h-5 w-5' />
            ) : (
              <XCircleIcon className='h-5 w-5' />
            )}
          </div>
        </h2>
        <div className='p-4'>
          {logsData.run.logs.map((log, index) => {
            if (log.logLevel === LogLevel.INFO) {
              let message = '';
              let json = undefined;
              if (log.message.trim() != '') {
                message = log.message;
              }

              if (log.node != undefined) {
                const type = log.node.type;
                const data = log.node.data;
                if (type === 'outputNode') {
                  json = {
                    output: data.output,
                  };
                }

                if (type === 'authNode') {
                  message = `${data.authType}`;
                }

                if (type === 'assertNode') {
                  message = `Assert : ${data.var1} of type ${typeof data.var1} ${data.operator} ${data.var2} of type ${typeof data.var2} = ${data.result}`;
                }

                if (type === 'delayNode') {
                  message = `Waiting for ${data.delay} ms`;
                }

                if (type === 'setVarNode') {
                  message = `Setting Variable:  ${data.name} = ${data.value}`;
                }

                if (type === 'requestNode') {
                  message = `${data.request.method.toUpperCase()} ${data.request.url}`;
                  json = data;
                }
              }

              return (
                <>
                  <ul className='menu w-full p-0' key={index}>
                    <li>
                      <div className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out'>
                        <div className='flex items-center justify-start gap-2 px-2 py-1'>
                          <ClockIcon className='h-6 w-6' />
                          <span className='text-lg'>{`${log.timestamp} : ${message}`}</span>
                        </div>
                      </div>
                      <ul className='flow-logs-menu before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-background-dark before:opacity-100'>
                        <li className='pl-4 pr-2'>
                          {json != undefined ? (
                            <div className='json-view-container my-4 w-full overflow-auto border border-slate-700 px-2 py-4'>
                              <React.Fragment>
                                <JsonView data={json} shouldExpandNode={collapseAllNested} style={defaultStyles} />
                              </React.Fragment>
                            </div>
                          ) : (
                            <></>
                          )}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </>
              );
            } else {
              return (
                <>
                  <ul className='menu w-full p-0' key={index}>
                    <li>
                      <div className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out'>
                        <div className='flex items-center justify-start gap-2 px-2 py-1 text-red-500'>
                          <ClockIcon className='h-6 w-6' />
                          <span className='text-lg'>{`${log.timestamp} : ${log.message}`}</span>
                        </div>
                      </div>
                      <ul className='flow-logs-menu before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-background-dark before:opacity-100'>
                        <li className='pl-4 pr-2'>
                          {log.node != undefined ? (
                            <div className='json-view-container my-4 overflow-auto border border-slate-700 px-2 py-4'>
                              <React.Fragment>
                                <JsonView
                                  data={log.node.data}
                                  shouldExpandNode={collapseAllNested}
                                  style={defaultStyles}
                                />
                              </React.Fragment>
                            </div>
                          ) : (
                            <></>
                          )}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default FlowLogs;
