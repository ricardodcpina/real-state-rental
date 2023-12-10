const mockFind = jest.fn()
const mockDelete = jest.fn()
const mockIdValidation = jest.fn()

const mockMongoose = { isValidObjectId: mockIdValidation }
const mockModels = {
    House: {
        findOne: mockFind,
        deleteOne: mockDelete
    }
}

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)

const houseService = require('../../src/services/house_service')

describe('deleteHouse', () => {
    describe('when the validation is successfull', () => {
        it('returns object with deleted count property', async () => {

            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue({ user: 'userId' })
            mockDelete.mockResolvedValue({
                "acknowledged": true,
                "deletedCount": 1
            })

            const deleted = houseService.deleteHouse('userId', 'houseId')

            await expect(deleted).resolves.toEqual({
                "acknowledged": true,
                "deletedCount": 1
            })

            expect(mockDelete).toHaveBeenCalledWith({
                _id: 'houseId'
            })
        })
    })

    describe('when the validation fails', () => {
        describe('when the ID is not a valid ObjectID', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(false)

                const deleted = houseService.deleteHouse('userId',
                    '646415')

                await expect(deleted).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockIdValidation).toHaveBeenCalledWith('646415')
            })
        })

        describe('when the given ID does not match any house', () => {
            it("returns an error", async () => {

                mockFind.mockResolvedValue(null)
                mockIdValidation.mockReturnValue(true)

                const deleted = houseService.deleteHouse('userId',
                    '64d6df45781a1517d42d5071')

                await expect(deleted).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockFind).toHaveBeenCalledWith(
                    { _id: '64d6df45781a1517d42d5071' }
                )
            })
        })

        describe('when the user is not the houses owner', () => {
            it('returns an error', async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue({ user: 'anotherId' })

                const deleted = houseService.deleteHouse('userId',
                    'houseId')

                await expect(deleted).rejects.toEqual(
                    { "message": 'Forbidden request', "statusCode": 403 }
                )
            })
        })
    })
})