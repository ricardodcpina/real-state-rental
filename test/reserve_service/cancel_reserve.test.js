const mockIdValidation = jest.fn()
const mockFind = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()

const mockModels = {
    Reserve: {
        findOne: mockFind,
        deleteOne: mockDelete
    },
    House: { updateOne: mockUpdate }
}

const mockMongoose = { isValidObjectId: mockIdValidation }

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)

const reserveService = require('../../src/services/reserve_service')

describe('cancelReserve', () => {
    describe('when the validation is successfull', () => {
        it('deletes the chosen reserve', async () => {
            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue({ user: 'userId' })
            mockDelete.mockResolvedValue({
                "acknowledged": true,
                "deletedCount": 1
            })

            const deleted = reserveService.cancelReserve('userId', 'reserveId')

            await expect(deleted).resolves.toEqual({
                "acknowledged": true,
                "deletedCount": 1
            })

            expect(mockDelete).toHaveBeenCalledWith({ _id: 'reserveId' })
        })
    })

    describe('when the validation fails', () => {
        describe('when the ID is not a valid ObjectID', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(false)

                const deleted = reserveService.cancelReserve('userId', 'reserveId')

                await expect(deleted).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockIdValidation).toHaveBeenCalledWith('reserveId')
            })
        })

        describe('when the given ID does not match any reserve', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue(null)

                const deleted = reserveService.cancelReserve('userId', 'reserveId')

                await expect(deleted).rejects.toEqual(
                    { "message": "Resource not found", "statusCode": 404 })

                expect(mockFind).toHaveBeenCalledWith({ _id: 'reserveId' })
            })
        })

        describe('when a user tries to cancel another users reserve', () => {
            it('returns an error', async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue({ user: 'anotherId' })

                const deleted = reserveService.cancelReserve('userId', 'reserveId')

                await expect(deleted).rejects.toEqual(
                    { "message": 'Forbidden request', "statusCode": 403 }
                )

                expect(mockFind).toHaveBeenCalledWith({ _id: 'reserveId' })
            })
        })
    })
})