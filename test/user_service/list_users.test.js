const mockFind = jest.fn()

const mockModels = {
    User: {
        find: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)

const userService = require('../../src/services/user_service')

describe('listUsers', () => {
    test('returns list of all users', async () => {
        const mockList = jest.fn()
        mockFind.mockResolvedValue(mockList)

        const user = userService.listUsers()

        await expect(user).resolves.toBe(mockList)
        expect(mockFind).toHaveBeenCalledWith({ deletedAt: null })
    })
})
