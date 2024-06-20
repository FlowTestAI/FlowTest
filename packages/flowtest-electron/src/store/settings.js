const Store = require('electron-store');

class Settings {
  constructor() {
    this.store = new Store();
  }

  addLogSyncConfig(enabled, hostUrl, accessId, accessKey) {
    this.store.set('logSyncConfig', { enabled, hostUrl, accessId, accessKey });
  }

  getAll() {
    return {
      logSyncConfig: this.store.get('logSyncConfig') || {},
    };
  }

  clearAll() {
    this.store.set('logSyncConfig', {});
  }
}

module.exports = Settings;
