const mockFind = jest.fn();

const mockModels = {
  House: {
    find: mockFind,
  },
};

jest.mock('../../src/models', () => mockModels);

const houseService = require('../../src/services/house_service');

describe('listHouses', () => {
  it('returns list of houses based on all filters', async () => {
    const mockList = jest.fn();
    mockFind.mockResolvedValue(mockList);

    const houses = houseService.listHouses(true, 10, 10, 400, 'Bahamas', 'mockName');

    await expect(houses).resolves.toBe(mockList);

    expect(mockFind).toHaveBeenCalledWith(
      {
        available: true,
        price: { $lte: 400 },
        location: { $regex: 'Bahamas', $options: 'i' },
        description: { $regex: 'mockName', $options: 'i' },
      },
      null,
      { limit: 10, skip: 10 }
    );
  });
});
