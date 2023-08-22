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

    describe("when the validation fails", () => {

        // Invalid username
        describe("when the username is undefined", () => {
            it("returns an error", async () => {
                const user = userService.createUser(undefined, "testemail", "testpassword")

                await expect(user).rejects.toEqual(
                    { "message": "USERNAME is required", "statusCode": 400 })
            })
        })

        describe("when the username is blank", () => {
            it("returns an error", async () => {
                const user = userService.createUser("   ", "testemail", "testpassword")

                await expect(user).rejects.toEqual(
                    { "message": "USERNAME is required", "statusCode": 400 })
            })
        })

        // Invalid password
        describe("when the password is undefined", () => {
            it("returns an error", async () => {
                const user = userService.createUser("testuser", "testemail", undefined)

                await expect(user).rejects.toEqual(
                    { "message": "PASSWORD is required", "statusCode": 400 })
            })
        })
        describe("when the password is blank", () => {
            it("returns an error", async () => {
                const user = userService.createUser("testuser", "testemail", "   ")

                await expect(user).rejects.toEqual(
                    { "message": "PASSWORD is required", "statusCode": 400 })
            })
        })

        // Invalid email
        describe("when the email is undefined", () => {
            it("returns an error", async () => {
                const user = userService.createUser("testuser", undefined, "testpassword")

                await expect(user).rejects.toEqual(
                    { "message": "EMAIL is required", "statusCode": 400 })
            })
        })
        describe("when the email is blank", () => {
            it("returns an error", async () => {
                const user = userService.createUser("testuser", "   ", "testpassword")

                await expect(user).rejects.toEqual(
                    { "message": "EMAIL is required", "statusCode": 400 })
            })
        })
        describe("when the email is not unique", () => {
            it("returns an error", async () => {
                const mockUser = jest.fn()

                mockFind.mockResolvedValue(mockUser)

                const user = userService.createUser("testuser", "testemail", "testpass")

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