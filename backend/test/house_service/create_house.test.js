const mockCreate = jest.fn()

const mockModels = {
    House: {
        create: mockCreate
    }
}

jest.mock('../../src/models', () => mockModels)

const houseService = require('../../src/services/house_service')

describe('createHouse', () => {
    describe('when the validation succeeds', () => {
        it('creates a house', async () => {
            const mockHouse = jest.fn()
            mockCreate.mockResolvedValue(mockHouse)

            const house = houseService.createHouse(
                'testUserId', 'filename', 'description', 'location', 500, true
            )

            await expect(house).resolves.toBe(mockHouse)

            expect(mockCreate).toHaveBeenCalledWith({
                user: 'testUserId', description: 'description',
                thumbnail: 'filename', price: 500,
                location: 'location', available: true
            })
        })
    })
})