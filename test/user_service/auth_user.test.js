const mockFind = jest.fn()

const mockModels = {
    User: {
        findOne: mockFind
    }
}

const mockSign = jest.fn()

const mockJWT = {
    sign: mockSign
}

jest.mock('../src/models', () => mockModels)
jest.mock('jsonwebtoken', () => mockJWT)

const userService = require('../../src/services/user_service')

describe("when the validation is successfull", () => {
    it("returns token for authorized user", async () => {
        const mockUser = jest.fn()
        const mockToken = jest.fn()
        mockUser.password = "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa."

        mockFind.mockResolvedValue(mockUser)
        mockSign.mockReturnValue(mockToken)

        const user = userService.authUser("testuser", "testpass")

        await expect(user).resolves.toEqual({ authenticated: true, token: mockToken })

        expect(mockFind).toHaveBeenCalledWith({ username: "testuser" })
    })
})

describe("when the validation fails", () => {
    describe("when the username is undefined", () => {
        it("returns an error", async () => {
            const user = userService.authUser(undefined, "testpassword")

            await expect(user).rejects.toThrow('Username is required')
        })
    })

    describe("when the username is blank", () => {
        it("returns an error", async () => {
            const user = userService.authUser("   ", "testpassword")

            await expect(user).rejects.toThrow('Username is required')
        })
    })

    describe("when the password is undefined", () => {
        it("returns an error", async () => {
            const user = userService.authUser("testuser", undefined)

            await expect(user).rejects.toThrow('Password is required')
        })
    })
    describe("when the password is blank", () => {
        it("returns an error", async () => {
            const user = userService.authUser("testuser", "   ")

            await expect(user).rejects.toThrow('Password is required')
        })
    })

    describe("when the given username does not match any user", () => {
        it("returns an error", async () => {

            mockFind.mockResolvedValue(null)

            const user = userService.authUser("testuser", "testpass")

            await expect(user).rejects.toThrow('Invalid credentials')

            expect(mockFind).toHaveBeenCalledWith({
                username: "testuser"
            })
        })
    })

    describe("when the user has been soft deleted", () => {
        it("returns an error", async () => {

            mockFind.mockResolvedValue({
                password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa.",
                deletedAt: "definedDeletedAt"
            })

            const user = userService.authUser("testuser", "testpass")

            await expect(user).rejects.toThrow('Invalid credentials')

            expect(mockFind).toHaveBeenCalledWith({
                username: "testuser"
            })
        })
    })

    describe("when the input password does not match the user password", () => {
        it("returns an error", async () => {
            mockFind.mockResolvedValue({
                password: "$2b$10$4K8VYfIHxZEatcUCWaklJORNamNV16GgE6wYLa9EjWonGwRPiExa."
            })

            const user = userService.authUser("testuser", "wrongpass")

            await expect(user).rejects.toThrow('Invalid credentials')

            expect(mockFind).toHaveBeenCalledWith({
                username: "testuser"
            })
        })
    })
})
