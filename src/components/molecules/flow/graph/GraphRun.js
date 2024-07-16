import useCollectionStore from 'stores/CollectionStore';
import GraphLogger, { LogLevel } from './GraphLogger';
import Graph from './Graph';
import { useTabStore } from 'stores/TabStore';
import { cloneDeep } from 'lodash';

export const graphRun = async (tab, nodes, edges, collectionPath, selectedEnv) => {
  useTabStore.getState().updateFlowTestRunStatus(tab.id, true);

  //runnableEdges(true);
  const startTime = Date.now();
  const logger = new GraphLogger();
  try {
    let envVariables = {};

    //const activeCollection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
    //const activeEnv = activeCollection?.environments.find((e) => e.name === useTabStore.getState().selectedEnv);
    if (selectedEnv) {
      envVariables = cloneDeep(selectedEnv.variables);
    }

    // ============= flow =====================
    const g = new Graph(
      nodes, //cloneDeep(reactFlowInstance.getNodes()),
      edges, //cloneDeep(reactFlowInstance.getEdges()),
      startTime,
      envVariables,
      logger,
      'main',
      collectionPath,
    );
    const result = await g.run();
    const time = Date.now() - startTime;
    logger.add(LogLevel.INFO, `Total time: ${time} ms`);
    useTabStore.getState().updateFlowTestRunStatus(tab.id, false);
    //await onGraphComplete(result.status, time, logger.get());
  } catch (error) {
    const time = Date.now() - startTime;
    logger.add(LogLevel.INFO, `Total time: ${time} ms`);
    useTabStore.getState().updateFlowTestRunStatus(tab.id, false);
    //await onGraphComplete('Failed', time, logger.get());
    //toast.error(`Internal error running graph`);
    //runnableEdges(false);
  }
};
