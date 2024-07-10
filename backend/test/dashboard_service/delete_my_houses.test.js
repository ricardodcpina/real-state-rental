const mockDeleteMany = jest.fn();

const mockModels = {
  House: {
    deleteMany: mockDeleteMany,
  },
};

jest.mock('../../src/models', () => mockModels);

const dashboardService = require('../../src/services/dashboard_service');

describe('deleteMyHouses', () => {
  it('deletes users owned houses', async () => {
    mockDeleteMany.mockResolvedValue({
      acknowledged: true,
      deletedCount: 5,
    });

    const deletedHouses = dashboardService.deleteMyHouses('userId');

    await expect(deletedHouses).resolves.toEqual({
      acknowledged: true,
      deletedCount: 5,
    });

    expect(mockDeleteMany).toHaveBeenCalledWith({ user: 'userId' });
  });
});
