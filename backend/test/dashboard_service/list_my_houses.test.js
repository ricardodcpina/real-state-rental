const mockFind = jest.fn();

const mockModels = {
  House: {
    find: mockFind,
  },
};

jest.mock('../../src/models', () => mockModels);

const dashboardService = require('../../src/services/dashboard_service');

describe('listMyHouses', () => {
  it('returns to user a list of his houses', async () => {
    const mockList = jest.fn();
    mockFind.mockResolvedValue(mockList);

    const list = dashboardService.listMyHouses('userId', 'limit', 'skip');

    await expect(list).resolves.toBe(mockList);

    expect(mockFind).toHaveBeenCalledWith({ user: 'userId' }, null, {
      limit: 'limit',
      skip: 'skip',
    });
  });
});
