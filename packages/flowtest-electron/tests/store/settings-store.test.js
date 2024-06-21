const Settings = require('../../src/store/settings');

describe('settings-store', () => {
  it('should create and get settings', async () => {
    const store = new Settings();
    store.clearAll();

    let settings = store.getAll();
    expect(settings.logSyncConfig).toEqual({});
    expect(settings.genAIUsageDisclaimer).toEqual(false);

    // adding a collection whose directory doesn't exist
    store.addLogSyncConfig(true, 'http://localhost:3000', 'access_id', 'access_key');
    store.addGenAIUsageDisclaimer(true);

    settings = store.getAll();
    const config = settings.logSyncConfig;
    expect(config.enabled).toEqual(true);
    expect(config.hostUrl).toEqual('http://localhost:3000');
    expect(config.accessId).toEqual('access_id');
    expect(config.accessKey).toEqual('access_key');

    expect(settings.genAIUsageDisclaimer).toEqual(true);
  });
});
