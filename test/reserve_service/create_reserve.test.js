const mockIdValidation = jest.fn()
const mockFind = jest.fn()
const mockUpdate = jest.fn()
const mockCreate = jest.fn()
const mockPopulate = jest.fn()

const mockMongoose = {
    isValidObjectId: mockIdValidation,
}

const mockModels = {
    House: { findOne: mockFind, updateOne: mockUpdate },
    Reserve: { create: mockCreate, populate: mockPopulate }
}

jest.mock('mongoose', () => mockMongoose)
jest.mock('../../src/models', () => mockModels)

const reserveService = require('../../src/services/reserve_service')

describe('createReserve', () => {
    describe('when the validation is successfull', () => {
        it('creates a reserve of another users house', async () => {
            const mockReserve = jest.fn()

            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue({ user: 'anotherId' })
            mockCreate.mockResolvedValue(mockReserve)

            const reserve = reserveService.createReserve('userId',
                'houseId', 'reserveDate')

            await expect(reserve).resolves.toBe(mockReserve)

            expect(mockCreate).toHaveBeenCalledWith(
                { user: 'userId', house: 'houseId', date: 'reserveDate' }
            )
        })
    })

    describe('when the validation fails', () => {
        describe('when the ID is not a valid ObjectID', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(false)

                const reserve = reserveService.createReserve('userId',
                    '646415', 'reserveDate')

                await expect(reserve).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockIdValidation).toHaveBeenCalledWith('646415')
            })
        })

        describe('when the given ID does not match any house', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue(null)

                const reserve = reserveService.createReserve('userId',
                    '64d6df45781a1517d42d5071', 'reserveDate')

                await expect(reserve).rejects.toEqual(
                    { "message": "Resource not found", "statusCode": 404 })

                expect(mockFind).toHaveBeenCalledWith(
                    { _id: '64d6df45781a1517d42d5071', available: true }
                )
            })
        })

        describe('when the user is the houses owner', () => {
            it('returns an error', async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue({ user: 'userId' })

                const reserve = reserveService.createReserve('userId',
                    'houseId', 'reserveDate')

                await expect(reserve).rejects.toEqual(
                    { "message": 'Forbidden request', "statusCode": 403 }
                )
            })
        })
    })
})