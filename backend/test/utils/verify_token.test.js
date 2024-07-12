const mockJwtVerify = jest.fn();

const mockJose = {
  jwtVerify: mockJwtVerify,
};

jest.mock('jose', () => mockJose);

const { verifyToken } = require('../../src/utils/utils');

describe('verifyToken', () => {
  it('returns decrypted payload from token when successfull', async () => {
    const mockUserId = '668c2f98958739fbdfd48cd';
    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NjhjMzdmOT';

    mockJwtVerify.mockResolvedValue({ payload: '668c2f98958739fbdfd48cd' });

    const payload = verifyToken(mockToken);

    await expect(payload).resolves.toBe(mockUserId);

    expect(mockJwtVerify).toHaveBeenCalledWith(
      mockToken,
      new TextEncoder().encode(process.env.HASH_SECRET),
      { algorithms: ['HS256'] }
    );
  });
});
