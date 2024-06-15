const LogLevel = Object.freeze({
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
});

class GraphLogger {
  constructor() {
    this.logs = [];
  }

  add(logLevel, message, node) {
    this.logs.push({
      level: logLevel,
      timestamp: new Date().toISOString(),
      message,
      node,
    });
  }

  get() {
    return this.logs;
  }
}

module.exports = {
  GraphLogger,
  LogLevel,
};
