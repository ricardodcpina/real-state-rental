const mockFindById = jest.fn()
const mockFind = jest.fn()
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
        it("returns the updated user", async () => {
            const mockUser = jest.fn()

            mockUpdate.mockResolvedValue(mockUser)
            mockFindById.mockResolvedValue(mockUser)

            const user = await userService.updateUser("64b884dbbfe1d03e39137e54",
                { username: "testuser", password: "testpass", email: "testemail" })

            expect(user).toBe(mockUser)
            expect(mockUpdate).toHaveBeenCalledWith(
                { _id: '64b884dbbfe1d03e39137e54' },
                {
                    username: "testuser",
                    password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa.",
                    email: "testemail"
                },
                { new: true }
            )
        })
    })

    describe("when the validation fails", () => {
        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", () => {

                const user = userService.updateUser("fakeID",
                    {
                        username: "testuser",
                        password: "testpass",
                        email: "testemail"
                    })

                user.catch(err => expect(err.message).toBe("Invalid ID"))
            })
        })

        describe("when the ID is not found", () => {
            it("returns an error", async () => {

                mockFindById.mockRejectedValue("Invalid ID")

                try {
                    await userService.updateUser("64b884dbbfe2d03f39137e24", // Fake ID
                        {
                            username: "testuser",
                            password: "testpass",
                            email: "testemail"
                        })
                }
                catch (err) {
                    expect(err).toBe("Invalid ID")
                }
                finally {
                    expect(mockFindById).toHaveBeenCalledWith({
                        _id: "64b884dbbfe2d03f39137e24"
                    })
                }
            })
        })

        describe("when the ID exists but user has been soft deleted", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()
                let user

                mockFindById.mockResolvedValue({
                    _id: "64b884dbbfe2d03f39137e24",
                    username: "testuser",
                    email: "testemail",
                    password: "testpass",
                    deletedAt: "testdelete"
                })
                mockUpdate.mockResolvedValue(mockUser)

                try {
                    user = await userService.updateUser("64b884dbbfe2d03f39137e24")
                }
                catch (err) {
                    expect(err.message).toBe("Invalid ID")
                }
                finally {
                    expect(user).toBeUndefined()
                    expect(mockFindById).toHaveBeenCalledWith({
                        _id: "64b884dbbfe2d03f39137e24"
                    })
                }
            })
        })

        // Invalid username
        describe("when the username is undefined", () => {
            it("returns an error", () => {
                const mockId = jest.fn()
                mockFindById.mockResolvedValue(mockId)

                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: undefined,
                        password: "testpass",
                        email: "testemail"
                    })

                user.catch(err => expect(err.message).toBe("Username is required"))
            })
        })
        describe("when the username is blank", () => {
            it("returns an error", () => {
                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: "   ",
                        password: "testpass",
                        email: "testemail"
                    })

                user.catch(err => expect(err.message).toBe("Username is required"))
            })
        })

        // Invalid password
        describe("when the password is undefined", () => {
            it("returns an error", () => {
                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: "testuser",
                        password: undefined,
                        email: "testemail"
                    })

                user.catch(err => expect(err.message).toBe("Password is required"))
            })
        })
        describe("when the password is blank", () => {
            it("returns an error", () => {
                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: "testuser",
                        password: "   ",
                        email: "testemail"
                    })

                user.catch(err => expect(err.message).toBe("Password is required"))
            })
        })

        // Invalid email
        describe("when the email is undefined", () => {
            it("returns an error", () => {
                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: "testuser",
                        password: "testpass",
                        email: undefined
                    })

                user.catch(err => expect(err.message).toBe("Email is required"))
            })
        })
        describe("when the email is blank", () => {
            it("returns an error", () => {
                const user = userService.updateUser("64b884dbbfe2d03f39137e24",
                    {
                        username: "testuser",
                        password: "testpass",
                        email: "   "
                    })

                user.catch(err => expect(err.message).toBe("Email is required"))
            })
        })
        describe("when the email is not unique", () => {
            it("returns an error", async () => {

                mockFind.mockRejectedValue("Email not available")

                try {
                    await userService.updateUser("64b884dbbfe2d03f39137e24",
                        {
                            username: "testuser",
                            password: "testpass",
                            email: "testemail"
                        })
                } catch (err) {
                    expect(err).toBe("Email not available")
                } finally {
                    expect(mockFind).toHaveBeenCalledWith({
                        email: "testemail",
                        deletedAt: { $exists: false }
                    })
                }
            })
        })
    })
})