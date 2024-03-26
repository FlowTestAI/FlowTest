import React from 'react';
import Flow, { init } from 'components/molecules/flow';
import { useTabStore } from 'stores/TabStore';
import useCanvasStore from 'stores/CanvasStore';
import TabPanelHeader from '../headers/TabPanelHeader';

const WorkspaceContent = () => {
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);

  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  if (focusTab) {
    console.log(`Tab changed to: ${focusTabId}`);
    console.log(focusTab);
    // perform actions based on the new tabId
    const result = init(focusTab.flowDataDraft ? focusTab.flowDataDraft : focusTab.flowData);
    setNodes(result.nodes);
    setEdges(result.edges);
  }

  return (
    <div className='flex flex-col h-full'>
      <TabPanelHeader />
      {focusTab ? (
        <Flow collectionId={focusTab.collectionId} />
      ) : (
        // This code will be exported out as its own component
        <div className='p-4'>
          <div>Test Tab panel for environment</div>
          <div className='overflow-x-auto'>
            <table className='table table-zebra'>
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Key</th>
                  <th>Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Test variable 1</td>
                  <td>ABC</td>
                  <td>
                    <input
                      type='text'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
                      placeholder='label'
                      required
                      onChange={(event) => {
                        const labelValue = event.target.value;
                        console.log(`New value for ABC: ${labelValue}`);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Test variable 2</td>
                  <td>DEF</td>
                  <td>
                    <input
                      type='text'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
                      placeholder='label'
                      required
                      onChange={(event) => {
                        const labelValue = event.target.value;
                        console.log(`New value for DEF: ${labelValue}`);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Test variable 3</td>
                  <td>ZXE</td>
                  <td>
                    <input
                      type='text'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
                      placeholder='label'
                      required
                      onChange={(event) => {
                        const labelValue = event.target.value;
                        console.log(`New value for ZXE: ${labelValue}`);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceContent;
