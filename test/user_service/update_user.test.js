const mockFind = jest.fn()
const mockFindById = jest.fn()
const mockUpdate = jest.fn()

const mockModels = {
    User: {
        findById: mockFindById,
        findOne: mockFind,
        findByIdAndUpdate: mockUpdate
    }
}

jest.mock('../src/models', () => mockModels)

const userService = require('../src/services/user_service')

describe("updateUser", () => {
    describe("when the validation is successfull", () => {
        it("updates an existing user", async () => {
            const mockUser = jest.fn()
            const mockUpdated = {
                username: "testuser",
                email: "testemail",
                password: "testpass"
            }

            mockFindById.mockResolvedValue(mockUser)
            mockFind.mockResolvedValue(undefined)
            mockUpdate.mockResolvedValue(mockUpdated)

            const user = userService.updateUser("64d2b46656b35a1c11984cb3",
                {
                    username: "testuser",
                    email: "testemail",
                    password: "testpass"
                })

            await expect(user).resolves.toBe(mockUpdated)

            expect(mockUpdate).toHaveBeenCalledWith(
                { _id: "64d2b46656b35a1c11984cb3" },
                {
                    username: "testuser",
                    email: "testemail",
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

                await expect(user).rejects.toThrow('Invalid ID')
            })
        })

        describe("when the given ID does not match any user", () => {
            it("returns an error", async () => {
                const mockInput = jest.fn()

                mockFindById.mockResolvedValue(null)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24", mockInput) // Valid ObjectID

                await expect(user).rejects.toThrow('Invalid ID')

                expect(mockFindById).toHaveBeenCalledWith({
                    _id: "64b884dbbfe2d03f39137e24"
                })

            })
        })

        describe("when the ID exists but user has been soft deleted", () => {
            it("returns an error", async () => {
                const mockInput = jest.fn()

                mockFindById.mockResolvedValue({
                    deletedAt: "definedDeletedAt"
                })

                const user = userService.updateUser("64b884dbbfe2d03f39137e24", mockInput) // Valid ObjectID

                await expect(user).rejects.toThrow('Invalid ID')

                expect(mockFindById).toHaveBeenCalledWith({
                    _id: "64b884dbbfe2d03f39137e24"
                })

            })
        })

        // Invalid username
        describe("when the username is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: undefined, email: "testemail", password: "testpass" })

                await expect(user).rejects.toThrow('Username is required')
            })
        })
        describe("when the username is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "   ", email: "testemail", password: "testpass" })

                await expect(user).rejects.toThrow('Username is required')
            })
        })

        // Invalid password
        describe("when the password is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: undefined })

                await expect(user).rejects.toThrow('Password is required')
            })
        })
        describe("when the password is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: "   " })

                await expect(user).rejects.toThrow('Password is required')
            })
        })

        // Invalid email
        describe("when the email is undefined", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: undefined, password: "testpass" })

                await expect(user).rejects.toThrow('Email is required')
            })
        })
        describe("when the email is blank", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "  ", password: "testpass" })

                await expect(user).rejects.toThrow('Email is required')
            })
        })
        describe("when the input email is not unique", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFindById.mockResolvedValue(mockUser)
                mockFind.mockResolvedValue(mockUser)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    { username: "testuser", email: "testemail", password: "testpass" })

                await expect(user).rejects.toThrow('Email not available')

                expect(mockFind).toHaveBeenCalledWith({
                    email: "testemail",
                    deletedAt: { $exists: false }
                })
            })
        })
    })
})
