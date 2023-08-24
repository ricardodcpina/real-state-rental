const realRegExpTest = RegExp.prototype.test
const mockFind = jest.fn()
const mockModels = {
    User: {
        findOne: mockFind
    }
}

jest.mock('../../src/models', () => mockModels)

const { verifyEmail } = require('../../src/services/user_service')

describe('verifyEmail', () => {
    describe('when the email does not exists', () => {

        beforeEach(() =>
            RegExp.prototype.test = jest.fn(() => true))

        it.only('returns true', async () => {
            mockFind.mockResolvedValue(null)

            const verified = verifyEmail('test@test.com')

            await expect(verified).resolves.toBe(true)
        })

        afterEach(() =>
            RegExp.prototype.test = realRegExpTest)
    })

    describe('when the email is not unique', () => {
        it.only('returns an error', async () => {
            const mockUser = jest.fn()
            mockFind.mockResolvedValue(mockUser)

            const verified = verifyEmail('test@test.com')

            await expect(verified).rejects.toEqual({
                "message": 'EMAIL not available', "statusCode": 409
            })
        })
    })

    describe('when the email is not formatted correctly', () => {
        it.only('returns an error', async () => {
            mockFind.mockResolvedValue(null)

            const verified = verifyEmail('invalid_email')

            await expect(verified).rejects.toEqual({
                'message': 'EMAIL format not valid', 'statusCode': 400
            })
        })
    })
})