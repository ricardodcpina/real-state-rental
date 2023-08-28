const mockFind = jest.fn()
const mockUpdate = jest.fn()
const mockIdValidation = jest.fn()

const mockMongoose = { isValidObjectId: mockIdValidation }
const mockModels = {
    User: {
        findOne: mockFind,
        findByIdAndUpdate: mockUpdate
    }
}

jest.mock('../../src/models', () => mockModels)
jest.mock('mongoose', () => mockMongoose)

const userService = require('../../src/services/user_service')

describe("updateUser", () => {
    describe("when the validation is successfull", () => {
        it("updates an existing user", async () => {
            const mockUser = { email: 'test@email.com' }
            const mockUpdated = {
                username: "testuser",
                email: "test@email.com",
                password: "testpass"
            }

            mockIdValidation.mockResolvedValue(true)
            mockFind.mockResolvedValue(mockUser)
            mockUpdate.mockResolvedValue(mockUpdated)

            const user = userService.updateUser("64d2b46656b35a1c11984cb3",
                {
                    username: "testuser",
                    email: "test@email.com",
                    password: "testpass"
                })

            await expect(user).resolves.toBe(mockUpdated)

            expect(mockUpdate).toHaveBeenCalledWith(
                { _id: "64d2b46656b35a1c11984cb3" },
                {
                    username: "testuser",
                    email: "test@email.com",
                    password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa."
                },
                { new: true }
            )
        })
    })

    describe("when the validation fails", () => {
        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", async () => {
                const mockInput = jest.fn()
                mockIdValidation.mockResolvedValue(false)

                const user = userService.updateUser("4846541", mockInput) // Invalid ObjectID

                await expect(user).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })
            })
        })

        describe("when the given ID does not match any user or is deleted", () => {
            it("returns an error", async () => {
                const mockInput = jest.fn()
                
                mockIdValidation.mockResolvedValue(true)
                mockFind.mockResolvedValue(null)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24", mockInput) // Valid ObjectID

                await expect(user).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })

                expect(mockFind).toHaveBeenCalledWith({
                    _id: '64b884dbbfe2d03f39137e24',
                    deletedAt: { $exists: false }
                }
                )
            })
        })
    })
})
