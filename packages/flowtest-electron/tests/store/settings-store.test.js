const Settings = require('../../src/store/settings');

describe('settings-store', () => {
  it('should create and get settings', async () => {
    const store = new Settings();
    store.clearAll();

    expect(store.getAll().logSyncConfig).toEqual({});

    // adding a collection whose directory doesn't exist
    store.addLogSyncConfig(true, 'http://localhost:3000', 'access_id', 'access_key');
    const config = store.getAll().logSyncConfig;
    expect(config.enabled).toEqual(true);
    expect(config.hostUrl).toEqual('http://localhost:3000');
    expect(config.accessId).toEqual('access_id');
    expect(config.accessKey).toEqual('access_key');
  });
});
