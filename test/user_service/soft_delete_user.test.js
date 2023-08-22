const mockFind = jest.fn()
const mockSoftDelete = jest.fn()

const RealDate = Date.now

const mockModels = {
    User: {
        findOne: mockFind,
        findByIdAndUpdate: mockSoftDelete
    }
}

jest.mock('../../src/models', () => mockModels)

const userService = require('../../src/services/user_service')

describe("softDeleteUser", () => {
    describe("when the validation is successfull", () => {

        beforeEach(() => {
            global.Date.now = jest.fn()
        })

        it("adds deletedAt field to user", async () => {

            const mockUser = jest.fn()

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
                const user = userService.softDeleteUser("846351")

                await expect(user).rejects.toEqual({
                    "message": "Invalid ID", "statusCode": 400
                })
            })
        })

        describe("when the given ID does not match any user or softDeleted", () => {
            it("returns an error", async () => {

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