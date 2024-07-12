const mockIdValidation = jest.fn();
const mockFind = jest.fn();
const mockVerifyEmail = jest.fn();
const mockHashPassword = jest.fn();
const mockUpdate = jest.fn();

const mockMongoose = { isValidObjectId: mockIdValidation };
const mockModels = {
  User: {
    findOne: mockFind,
    findByIdAndUpdate: mockUpdate,
  },
};
const mockUtils = {
  validateFields: jest.fn(),
  verifyEmail: mockVerifyEmail,
  hashPassword: mockHashPassword,
};

jest.mock('mongoose', () => mockMongoose);
jest.mock('../../src/models', () => mockModels);
jest.mock('../../src/utils/utils', () => mockUtils);

const userService = require('../../src/services/user_service');
const { validateFields } = require('../../src/utils/utils');

describe('updateUser', () => {
  describe('when the validation is successfull', () => {
    describe('when the user provides a new email and password', () => {
      it('updates an existing user with provided fields', async () => {
        const mockUser = { email: 'test@email.com', password: 'password' };
        const mockUpdated = {
          username: 'testuser',
          email: 'new@email.com',
          password: 'newpassword',
        };

        mockIdValidation.mockResolvedValue(true);
        mockFind.mockResolvedValue(mockUser);
        mockVerifyEmail.mockResolvedValue(true);
        mockHashPassword.mockReturnValue('EatcUCWaklJORNamNV16GgE6');
        mockUpdate.mockResolvedValue(mockUpdated);

        const user = userService.updateUser('64d2b46656b35a1c11984cb3', {
          username: 'testuser',
          email: 'new@email.com',
          password: 'newpassword',
        });

        await expect(user).resolves.toBe(mockUpdated);

        expect(mockUpdate).toHaveBeenCalledWith(
          { _id: '64d2b46656b35a1c11984cb3' },
          {
            username: 'testuser',
            email: 'new@email.com',
            password: 'EatcUCWaklJORNamNV16GgE6',
          },
          { new: true }
        );
      });
    });
  });

  describe('when the validation fails', () => {
    describe('when the ID is not a valid ObjectID', () => {
      it('returns an error', async () => {
        const mockInput = jest.fn();
        mockIdValidation.mockReturnValue(false);

        const user = userService.updateUser('4846541', mockInput); // Invalid ObjectID

        await expect(user).rejects.toEqual({ message: 'Invalid ID', statusCode: 400 });
      });
    });

    describe('when the given ID does not match any user or is deleted', () => {
      it('returns an error', async () => {
        const mockInput = jest.fn();

        mockIdValidation.mockResolvedValue(true);
        mockFind.mockResolvedValue(null);

        const user = userService.updateUser('64b884dbbfe2d03f39137e24', mockInput); // Valid ObjectID

        await expect(user).rejects.toEqual({ message: 'Invalid ID', statusCode: 400 });

        expect(mockFind).toHaveBeenCalledWith({
          _id: '64b884dbbfe2d03f39137e24',
          deletedAt: { $exists: false },
        });
      });
    });
  });
});
