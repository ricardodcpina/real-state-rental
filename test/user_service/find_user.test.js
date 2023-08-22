const mockFind = jest.fn()

const mockModels = {
    User: {
        findOne: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)

const userService = require('../../src/services/user_service')

describe("findUser", () => {
    describe("when validations are successfull", () => {
        it("returns the specified user", async () => {
            const mockUser = jest.fn()

            mockFind.mockResolvedValue(mockUser)

            const user = userService.findUser("64b884dbbfe1d03e39137e24")

            await expect(user).resolves.toBe(mockUser)
            expect(mockFind).toHaveBeenCalledWith({
                _id: "64b884dbbfe1d03e39137e24",
                deletedAt: { $exists: false }
            })
        })
    })

    describe("when the validation fails", () => {

        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", async () => {
                const user = userService.findUser("4846541") // Invalid ObjectID

                await expect(user).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })
            })
        })

        describe("when the given ID does not match any user or softDeleted", () => {
            it("returns an error", async () => {

                mockFind.mockResolvedValue(null)

                const user = userService.findUser("64b884dbbfe2d03f39137e24") // Valid ObjectID

                await expect(user).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockFind).toHaveBeenCalledWith({
                    _id: "64b884dbbfe2d03f39137e24",
                    deletedAt: { $exists: false }
                })

            })
        })
    })
})