const mockFind = jest.fn();
const mockGenerateToken = jest.fn();
const mockValidateFields = jest.fn();
const mockHashPassword = jest.fn();

const mockModels = {
  User: {
    findOne: mockFind,
  },
};

const mockUtils = {
  validateFields: mockValidateFields,
  generateToken: mockGenerateToken,
  hashPassword: mockHashPassword,
};

jest.mock('../../src/models', () => mockModels);
jest.mock('../../src/utils/utils', () => mockUtils);

const userService = require('../../src/services/user_service');

describe('when the validation is successfull', () => {
  it('returns token for authorized user', async () => {
    const mockUser = {
      _id: 'userId',
      password: '$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa.',
    };
    const mockToken = 'eyJhbGciOiJIUzI1NrWCJD1wXyG-e_wfLmo-5oxfJGOU';
    const mockPassword = mockUser.password;

    mockFind.mockResolvedValue(mockUser);
    mockHashPassword.mockResolvedValue(mockPassword);
    mockGenerateToken.mockResolvedValue(mockToken);

    const user = userService.authUser('testuser', 'testpass');

    await expect(user).resolves.toEqual({
      authenticated: true,
      token: mockToken,
      userId: mockUser._id,
    });

    expect(mockFind).toHaveBeenCalledWith({
      username: 'testuser',
      deletedAt: { $exists: false },
    });
  });
});

describe('when the validation fails', () => {
  describe('when the given username does not match any user or softdeleted', () => {
    it('returns an error', async () => {
      mockFind.mockResolvedValue(null);

      const user = userService.authUser('testuser', 'testpass');

      await expect(user).rejects.toEqual({ message: 'Invalid credentials', statusCode: 401 });

      expect(mockFind).toHaveBeenCalledWith({
        username: 'testuser',
        deletedAt: { $exists: false },
      });
    });
  });

  describe('when the input password does not match the user password', () => {
    it('returns an error', async () => {
      mockFind.mockResolvedValue({
        password: '$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa.',
      });

      const user = userService.authUser('testuser', 'wrongpass');

      await expect(user).rejects.toEqual({ message: 'Invalid credentials', statusCode: 401 });

      expect(mockFind).toHaveBeenCalledWith({
        username: 'testuser',
        deletedAt: { $exists: false },
      });
    });
  });
});
