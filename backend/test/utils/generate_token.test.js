const mockSignJWT = jest.fn();
const mockSetProtectedHeader = jest.fn();
const mockIssuedAt = jest.fn();
const mockExpiration = jest.fn();
const mockJWT = jest.fn();

jest.mock('jose', () => {
  return {
    SignJWT: mockSignJWT,
  };
});

const { generateToken } = require('../../src/utils/utils');

describe('generateToken', () => {
  it('should return a JWT token with provided userId as payload', async () => {
    const mockUserId = '668c2f98958739fbdfd48cd';
    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NjhjMzdmOT';

    mockSignJWT.mockImplementation(function () {
      return {
        setProtectedHeader: mockSetProtectedHeader.mockReturnThis(),
        setIssuedAt: mockIssuedAt.mockReturnThis(),
        setExpirationTime: mockExpiration.mockReturnThis(),
        sign: mockJWT,
      };
    });
    mockJWT.mockResolvedValue(mockToken);

    const token = generateToken(mockUserId);

    await expect(token).resolves.toBe(mockToken);

    expect(mockSignJWT).toHaveBeenCalledWith({ sub: mockUserId });
    expect(mockSetProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    expect(mockIssuedAt).toHaveBeenCalledWith();
    expect(mockExpiration).toHaveBeenCalledWith('60s');
    expect(mockJWT).toHaveBeenCalledWith(new TextEncoder().encode(process.env.HASH_SECRET));
  });
});
