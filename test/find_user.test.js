const mockFindById = jest.fn()

const mockModels = {
    User: {
        findById: mockFindById
    }
}

jest.mock('../src/models', () => mockModels)

const userService = require('../src/services/user_service')

describe("findUser", () => {
    describe("when validations are successfull", () => {
        it("returns the specified user", async () => {
            const mockUser = jest.fn()

            mockFindById.mockResolvedValue(mockUser)

            const user = await userService.findUser("64b884dbbfe1d03e39137e24")

            expect(user).toBe(mockUser)
            expect(mockFindById).toHaveBeenCalledWith({
                _id: "64b884dbbfe1d03e39137e24"
            })
        })
    })

    describe("when the validation fails", () => {
        describe("when the ID is not a valid ObjectID", () => {
            it("returns an error", () => {
                const user = userService.findUser("fakeObjectID")

                user.catch(err => expect(err.message).toBe("Invalid ID"))
            })
        })

        describe("when the ID is not found", () => {
            it("returns an error", async () => {

                mockFindById.mockRejectedValue("Invalid ID")

                try {
                    await userService.findUser("64b884dbbfe2d03f39137e24") // Fake ID
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

                mockFindById.mockResolvedValue({
                    _id: "64b884dbbfe2d03f39137e24",
                    username: "testuser",
                    email: "testemail",
                    password: "testpass",
                    deletedAt: "testtime"
                })

                try {
                    await userService.findUser("64b884dbbfe2d03f39137e24")
                }
                catch (err) {
                    expect(err.message).toBe("Invalid ID")
                }
                finally {
                    expect(mockFindById).toHaveBeenCalledWith({
                        _id: "64b884dbbfe2d03f39137e24"
                    })
                }
            })
        })
    })
})