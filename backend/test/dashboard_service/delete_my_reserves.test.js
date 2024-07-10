const mockDeleteMany = jest.fn();

const mockModels = {
  House: {
    deleteMany: mockDeleteMany,
  },
};

jest.mock('../../src/models', () => mockModels);

const dashboardService = require('../../src/services/dashboard_service');

describe('deleteMyReserves', () => {
  it('cancels the users reserves', async () => {
    mockDeleteMany.mockResolvedValue({
      acknowledged: true,
      deletedCount: 3,
    });

    const deletedHouses = dashboardService.deleteMyHouses('userId');

    await expect(deletedHouses).resolves.toEqual({
      acknowledged: true,
      deletedCount: 3,
    });

    expect(mockDeleteMany).toHaveBeenCalledWith({ user: 'userId' });
  });
});
