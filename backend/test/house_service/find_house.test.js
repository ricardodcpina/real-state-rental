const mockFind = jest.fn()
const mockIdValidation = jest.fn()

const mockMongoose = { isValidObjectId: mockIdValidation }
const mockModels = {
    House: {
        findOne: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)

const houseService = require('../../src/services/house_service')

describe("findHouse", () => {
    describe("when validations are successfull", () => {
        it("returns the specified house", async () => {
            const mockHouse = jest.fn()

            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue(mockHouse)

            const house = houseService.findHouse("mock_house_id")

            await expect(house).resolves.toBe(mockHouse)
            expect(mockFind).toHaveBeenCalledWith({
                _id: "mock_house_id"
            })
        })
    })

    describe("when the validation fails", () => {

        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", async () => {
                mockIdValidation.mockReturnValue(false)

                const house = houseService.findHouse("4846541") // Invalid ObjectID

                await expect(house).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })
            })
        })

        describe("when the given ID does not match any house", () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue(null)

                const house = houseService.findHouse("64b884dbbfe2d03f39137e24") // Valid ObjectID

                await expect(house).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockFind).toHaveBeenCalledWith({
                    _id: "64b884dbbfe2d03f39137e24"
                })
            })
        })
    })
})