const mockFind = jest.fn()
const mockSoftDelete = jest.fn()
const mockIdValidation = jest.fn()
const RealDate = Date.now

const mockMongoose = { isValidObjectId: mockIdValidation }
const mockModels = {
    User: {
        findOne: mockFind,
        findByIdAndUpdate: mockSoftDelete
    }
}

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)

const userService = require('../../src/services/user_service')

describe("softDeleteUser", () => {
    describe("when the validation is successfull", () => {

        beforeEach(() =>
            global.Date.now = jest.fn()
        )

        it("adds deletedAt field to user", async () => {

            const mockUser = jest.fn()

            mockIdValidation.mockReturnValue(true)
            mockFind.mockResolvedValue(mockUser)
            mockSoftDelete.mockResolvedValue(mockUser)

            const user = userService.softDeleteUser("64b884dbbfe2d03f39137e24")

            await expect(user).resolves.toBe(mockUser)

            expect(mockFind).toHaveBeenCalledWith({
                _id: "64b884dbbfe2d03f39137e24",
                deletedAt: { $exists: false }
            })

            expect(mockSoftDelete).toHaveBeenCalledWith(
                { _id: "64b884dbbfe2d03f39137e24" }, { deletedAt: Date.now() }, { new: true }
            )
        })

        afterEach(() => {
            global.Date.now = RealDate
        })
    })

    describe("when the validation fails", () => {
        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", async () => {
                mockIdValidation.mockReturnValue(false)

                const user = userService.softDeleteUser("846351")

                await expect(user).rejects.toEqual({
                    "message": "Invalid ID", "statusCode": 400
                })
            })
        })

        describe("when the given ID does not match any user or is deleted", () => {
            it("returns an error", async () => {

                mockIdValidation.mockReturnValue(true)
                mockFind.mockResolvedValue(null)

                const user = userService.findUser("64b884dbbfe2d03f39137e24")

                await expect(user).rejects.toEqual({
                    "message": "Invalid ID", "statusCode": 400
                })

                expect(mockFind).toHaveBeenCalledWith({
                    _id: "64b884dbbfe2d03f39137e24",
                    deletedAt: { $exists: false }
                })
            })
        })
    })
})