const MOCK_CACHE_DIR = 'file:///mock/cache/';

module.exports = {
  cacheDirectory: MOCK_CACHE_DIR,
  deleteAsync: jest.fn().mockResolvedValue(undefined),
};
