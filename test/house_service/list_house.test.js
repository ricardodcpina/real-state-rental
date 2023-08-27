const mockFind = jest.fn()

const mockModels = {
    House: {
        find: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)

const houseService = require('../../src/services/house_service')

describe('listHouses', () => {
    it('returns list of housese based on "available" field filter', async () => {
        const mockList = jest.fn()
        mockFind.mockResolvedValue(mockList)

        const houses = houseService.listHouses({ available: true })

        await expect(houses).resolves.toBe(mockList)
    })
})