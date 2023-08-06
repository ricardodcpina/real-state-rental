const mockCreate = jest.fn()
const mockFind = jest.fn()

const mockModels = {
    User: {
        create: mockCreate,
        findOne: mockFind
    }
}

jest.mock('../src/models', () => mockModels)

const userService = require('../src/services/user_service')

describe("createUser", () => {
    describe("when the validation is successfull", () => {

        it("creates an user", async () => {
            const mockUser = jest.fn()

            mockCreate.mockResolvedValue(mockUser)

            const user = await userService.createUser("testuser", "testemail", "testpass")

            expect(user).toBe(mockUser)
            expect(mockCreate).toHaveBeenCalledWith({
                username: "testuser",
                email: "testemail",
                password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa."
            })
        })
    })

    describe("when the validation fails", () => {

        // Invalid username
        describe("when the username is undefined", () => {
            it("returns an error", () => {
                const user = userService.createUser(undefined, "testemail", "testpassword")

                user.catch(err => expect(err.message).toBe("Username is required"))
            })
        })
        describe("when the username is blank", () => {
            it("returns an error", () => {
                const user = userService.createUser("   ", "testemail", "testpassword")

                user.catch(err => expect(err.message).toBe("Username is required"))
            })
        })

        // Invalid password
        describe("when the password is undefined", () => {
            it("returns an error", () => {
                const user = userService.createUser("testuser", "testemail", undefined)

                user.catch(err => expect(err.message).toBe("Password is required"))
            })
        })
        describe("when the password is blank", () => {
            it("returns an error", () => {
                const user = userService.createUser("testuser", "testemail", "   ")

                user.catch(err => expect(err.message).toBe("Password is required"))
            })
        })

        // Invalid email
        describe("when the email is undefined", () => {
            it("returns an error", () => {
                const user = userService.createUser("testuser", undefined, "testpassword")

                user.catch(err => expect(err.message).toBe("Email is required"))
            })
        })
        describe("when the email is blank", () => {
            it("returns an error", () => {
                const user = userService.createUser("testuser", "   ", "testpassword")

                user.catch(err => expect(err.message).toBe("Email is required"))
            })
        })
        describe("when the email is not unique", () => {
            it("returns an error", async () => {

                mockFind.mockRejectedValue("Email not available")

                try {
                    await userService.createUser(
                        "testuser",
                        "testemail",
                        "testpass")
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