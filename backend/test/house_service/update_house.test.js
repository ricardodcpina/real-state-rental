const mockFind = jest.fn()
const mockFindAndUpdate = jest.fn()
const mockIdValidation = jest.fn()

const mockModels = {
    House: {
        findByIdAndUpdate: mockFindAndUpdate,
        findOne: mockFind
    }
}

const mockMongoose = { isValidObjectId: mockIdValidation }

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)


const houseService = require('../../src/services/house_service')

describe('updateHouse', () => {
    describe('when the validation is successfull', () => {
        it('returns the updated house', async () => {
            const mockUpdated = jest.fn()
            const mockHouse = { user: 'userId' }

            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue(mockHouse)
            mockFindAndUpdate.mockResolvedValue(mockUpdated)

            const house = houseService.updateHouse('userId',
                '64d6df45781a1517d42d5071', { price: 500 }, 'filename.png')

            await expect(house).resolves.toBe(mockUpdated)

            expect(mockFind).toHaveBeenCalledWith(
                { _id: '64d6df45781a1517d42d5071' }
            )

            expect(mockFindAndUpdate).toHaveBeenCalledWith(
                { _id: '64d6df45781a1517d42d5071' },
                { thumbnail: 'filename.png', price: 500 }, { new: true }
            )
        })
    })

    describe('when the validation fails', () => {
        describe('when the ID is not a valid ObjectID', () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(false)

                const house = houseService.updateHouse('userId',
                    '646415', {})

                await expect(house).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockIdValidation).toHaveBeenCalledWith('646415')
            })
        })

        describe('when the given ID does not match any house', () => {
            it("returns an error", async () => {

                mockFind.mockResolvedValue(null)
                mockIdValidation.mockReturnValue(true)

                const house = houseService.updateHouse('userId',
                    '64d6df45781a1517d42d5071', {})

                await expect(house).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockFind).toHaveBeenCalledWith(
                    { _id: '64d6df45781a1517d42d5071' }
                )
            })
        })

        describe('when the user tries to change the houses "user" field', () => {
            it('returns an error', async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue({ user: 'userId' })

                const house = houseService.updateHouse('userId',
                    'houseId', { user: 'anotherId' })

                await expect(house).rejects.toEqual(
                    { "message": 'Forbidden request', "statusCode": 403 })
            })
        })

        describe('when the user is not the houses owner', () => {
            it('returns an error', async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue({ user: 'anotherId' })

                const house = houseService.updateHouse('userId',
                    'houseId', {})

                await expect(house).rejects.toEqual(
                    { "message": 'Forbidden request', "statusCode": 403 }
                )
            })
        })
    })
})
