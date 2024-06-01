export const LogLevel = Object.freeze({
  INFO: 0,
  WARN: 1,
  ERROR: 2,
});

class GraphLogger {
  constructor() {
    this.logs = [];
  }

  add(logLevel, message, node) {
    this.logs.push({
      logLevel,
      timestamp: new Date().toISOString(),
      message,
      node,
    });
  }

  get() {
    return this.logs;
  }
}

export default GraphLogger;
