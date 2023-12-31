const mockFind = jest.fn()
const mockPopulate = jest.fn()

const mockModels = {
    Reserve: {
        find: mockFind,
        populate: mockPopulate
    }
}

jest.mock('../../src/models', () => mockModels)

const reserveService = require('../../src/services/reserve_service')

describe('listMyReserves', () => {
    it('returns a list of users active house reserves', async () => {
        const mockList = jest.fn()
        mockFind.mockResolvedValue(mockList)

        const list = reserveService.listMyReserves('userId')

        await expect(list).resolves.toBe(mockList)
    })
})