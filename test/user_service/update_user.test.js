const mockFind = jest.fn()
const mockFindById = jest.fn()
const mockUpdate = jest.fn()

const mockModels = {
    User: {
        findOne: mockFind,
        findByIdAndUpdate: mockUpdate
    }
}

jest.mock('../../src/models', () => mockModels)

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

                const user = userService.updateUser("4846541", mockInput) // Invalid ObjectID

                await expect(user).rejects.toEqual(
                    { "message": "Invalid ID", "statusCode": 400 })
            })
        })

        describe("when the given ID does not match any user or softDeleted", () => {
            it("returns an error", async () => {
                const mockInput = jest.fn()

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

        // Invalid username
        describe("when the username is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: undefined, email: "testemail", password: "testpass" })

                await expect(user).rejects.toEqual(
                    { "message": "USERNAME is required", "statusCode": 400 })
            })
        })
        describe("when the username is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "   ", email: "testemail", password: "testpass" })

                await expect(user).rejects.toEqual(
                    { "message": "USERNAME is required", "statusCode": 400 })
            })
        })

        // Invalid password
        describe("when the password is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: undefined })

                await expect(user).rejects.toEqual(
                    { "message": "PASSWORD is required", "statusCode": 400 })
            })
        })
        describe("when the password is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: "   " })

                await expect(user).rejects.toEqual(
                    { "message": "PASSWORD is required", "statusCode": 400 })
            })
        })

        // Invalid email
        describe("when the email is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: undefined, password: "testpass" })

                await expect(user).rejects.toEqual(
                    { "message": "EMAIL is required", "statusCode": 400 })
            })
        })
        describe("when the email is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "  ", password: "testpass" })

                await expect(user).rejects.toEqual(
                    { "message": "EMAIL is required", "statusCode": 400 })
            })
        })
        describe("when the input email is not unique", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: "testpass" })

                await expect(user).rejects.toEqual(
                    { "message": "EMAIL not available", "statusCode": 409 })

                expect(mockFind).toHaveBeenCalledWith({
                    email: "testemail",
                    deletedAt: { $exists: false }
                })
            })
        })
    })
})
