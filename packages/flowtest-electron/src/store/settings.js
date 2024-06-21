const Store = require('electron-store');

class Settings {
  constructor() {
    this.store = new Store();
  }

  addLogSyncConfig(enabled, hostUrl, accessId, accessKey) {
    this.store.set('logSyncConfig', { enabled, hostUrl, accessId, accessKey });
  }

  addGenAIUsageDisclaimer(accepted) {
    this.store.set('genAIUsageDisclaimer', accepted);
  }

  getAll() {
    return {
      logSyncConfig: this.store.get('logSyncConfig') || {},
      genAIUsageDisclaimer: this.store.get('genAIUsageDisclaimer') || false,
    };
  }

  clearAll() {
    this.store.set('logSyncConfig', {});
    this.store.set('genAIUsageDisclaimer', false);
  }
}

module.exports = Settings;
