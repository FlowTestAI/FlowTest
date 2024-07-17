import GraphLogger, { LogLevel } from './GraphLogger';
import Graph from './Graph';
import { useTabStore } from 'stores/TabStore';
import { cloneDeep } from 'lodash';
import { uploadGraphRunLogs } from 'service/collection';
import { toast } from 'react-toastify';

const postResult = async (tab, status, time, logs) => {
  const response = await uploadGraphRunLogs(tab.name, status, time, logs);
  useTabStore.getState().updateFlowTestLogs(tab.id, status, logs, response);
  useTabStore.getState().updateFlowTestRunStatus(tab.id, false);
  if (status == 'Success') {
    toast.success(`FlowTest Run Success!`);
  } else if (status == 'Failed') {
    toast.error(`FlowTest Run Failed!`);
  }
};

export const graphRun = async (tab, nodes, edges, timeout, collectionPath, selectedEnv) => {
  useTabStore.getState().updateFlowTestRunStatus(tab.id, true);

  const startTime = Date.now();
  const logger = new GraphLogger();
  try {
    let envVariables = {};

    if (selectedEnv) {
      envVariables = cloneDeep(selectedEnv.variables);
    }

    // ============= flow =====================
    const g = new Graph(nodes, edges, startTime, envVariables, logger, collectionPath, timeout, tab);
    const result = await g.run();
    const time = Date.now() - startTime;
    logger.add(LogLevel.INFO, `Total time: ${time} ms`);

    await postResult(tab, result.status, time, logger.get());
  } catch (error) {
    const time = Date.now() - startTime;
    logger.add(LogLevel.ERROR, 'Internal error running graph');
    logger.add(LogLevel.INFO, `Total time: ${time} ms`);
    await postResult(tab, 'Failed', time, logger.get());
  }
};
