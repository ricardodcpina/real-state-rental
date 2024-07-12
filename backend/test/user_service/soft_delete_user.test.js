const mockFind = jest.fn();
const mockSoftDelete = jest.fn();
const mockIdValidation = jest.fn();
const mockListMyReserves = jest.fn();
const mockListMyHouses = jest.fn();
const mockCancelReserve = jest.fn();
const mockDeleteHouse = jest.fn();
const RealDate = Date.now;

const mockMongoose = { isValidObjectId: mockIdValidation };
const mockModels = {
  User: {
    findOne: mockFind,
    findByIdAndUpdate: mockSoftDelete,
  },
};
const mockDashboardServices = {
  listMyReserves: mockListMyReserves,
  listMyHouses: mockListMyHouses,
};
const mockReserveServices = {
  cancelReserve: mockCancelReserve,
};
const mockHouseServices = {
  deleteHouse: mockDeleteHouse,
};

jest.mock('mongoose', () => mockMongoose);
jest.mock('../../src/models', () => mockModels);
jest.mock('../../src/services/dashboard_service', () => mockDashboardServices);
jest.mock('../../src/services/reserve_service', () => mockReserveServices);
jest.mock('../../src/services/house_service.js', () => mockHouseServices);

const userService = require('../../src/services/user_service');

describe('softDeleteUser', () => {
  describe('when the validation is successfull', () => {
    beforeEach(() => (global.Date.now = jest.fn()));

    it('adds deletedAt field to user', async () => {
      const mockUser = jest.fn();

      mockIdValidation.mockReturnValue(true);
      mockFind.mockResolvedValue(mockUser);
      mockListMyReserves.mockResolvedValue([{ _id: 'reserve_1' }, { _id: 'reserve_2' }]);
      mockListMyHouses.mockResolvedValue([{ _id: 'estate_1' }, { _id: 'estate_2' }]);
      mockSoftDelete.mockResolvedValue(mockUser);

      const user = userService.softDeleteUser('64b884dbbfe2d03f39137e24');

      await expect(user).resolves.toBe(mockUser);

      expect(mockFind).toHaveBeenCalledWith({
        _id: '64b884dbbfe2d03f39137e24',
        deletedAt: { $exists: false },
      });

      expect(mockSoftDelete).toHaveBeenCalledWith(
        { _id: '64b884dbbfe2d03f39137e24' },
        { deletedAt: Date.now() },
        { new: true }
      );
    });

    afterEach(() => {
      global.Date.now = RealDate;
    });
  });

  describe('when the validation fails', () => {
    describe('when the ID is not a valid ObjectID', () => {
      it('returns an error', async () => {
        mockIdValidation.mockReturnValue(false);

        const user = userService.softDeleteUser('846351');

        await expect(user).rejects.toEqual({
          message: 'Invalid ID',
          statusCode: 400,
        });
      });
    });

    describe('when the given ID does not match any user or is deleted', () => {
      it('returns an error', async () => {
        mockIdValidation.mockReturnValue(true);
        mockFind.mockResolvedValue(null);

        const user = userService.softDeleteUser('64b884dbbfe2d03f39137e24');

        await expect(user).rejects.toEqual({
          message: 'Invalid ID',
          statusCode: 400,
        });

        expect(mockFind).toHaveBeenCalledWith({
          _id: '64b884dbbfe2d03f39137e24',
          deletedAt: { $exists: false },
        });
      });
    });
  });
});
