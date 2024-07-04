const mockCreate = jest.fn()
const mockFind = jest.fn()

const mockModels = {
    User: {
        create: mockCreate,
        findOne: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)

const userService = require('../../src/services/user_service')

describe("createUser", () => {
    describe("when the validation is successfull", () => {
        it("creates an user", async () => {
            const mockUser = jest.fn()

            mockCreate.mockResolvedValue(mockUser)
            mockFind.mockResolvedValue(null)

            const user = userService.createUser("testuser", "test@email.com", "testpass")

            await expect(user).resolves.toBe(mockUser)
            expect(mockFind).toHaveBeenCalledWith({
                email: "test@email.com",
                deletedAt: { $exists: false }
            })
            expect(mockCreate).toHaveBeenCalledWith({
                username: "testuser",
                email: "test@email.com",
                password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa."
            })
        })
    })
})