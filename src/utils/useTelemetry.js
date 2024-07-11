/**
 * Telemetry in FlowTestAI is just an anonymous visit counter (triggered once per day).
 * The only details shared are:
 *      - OS (ex: mac, windows, linux)
 *      - Version (ex: 1.3.0)
 * We don't track usage analytics / micro-interactions / crash logs / anything else.
 */

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import getConfig from 'next/config';
import { PostHog } from 'posthog-node';

const posthogApiKey = 'phc_NWEriNXcUcZ1QB3GDBHrM3NDzZj69P1npzZ9PY2A5tW';
let posthogClient = null;

const getPosthogClient = () => {
  if (posthogClient) {
    return posthogClient;
  }

  posthogClient = new PostHog(posthogApiKey);
  return posthogClient;
};

const getAnonymousId = () => {
  let id = localStorage.getItem('flowtestai.anonymousId');

  if (!id || !id.length || id.length !== 21) {
    id = uuidv4();
    localStorage.setItem('flowtestai.anonymousId', id);
  }

  return id;
};

const trackStart = () => {
  const { ipcRenderer } = window;
  const id = getAnonymousId();
  const client = getPosthogClient();
  client.capture({
    distinctId: id,
    event: 'start',
    properties: {
      os: ipcRenderer.isMacOs() ? 'darwin' : 'win32',
      version: '1.2.0',
    },
  });
};

const useTelemetry = () => {
  useEffect(() => {
    trackStart();
    setInterval(trackStart, 24 * 60 * 60 * 1000);
  }, []);
};

export default useTelemetry;
