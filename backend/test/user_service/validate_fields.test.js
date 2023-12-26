const { validateFields } = require('../../src/services/user_service')

describe('validateFields', () => {
    describe('when the validation is successfull', () => {
        it('returns true', () => {
            const validate = validateFields(
                { field_1: 'field_1', field_2: 'field_2' })

            expect(validate).toBe(true)
        })
    })

    describe('when the validation fails', () => {
        describe('when the field is undefined', () => {
            it('returns an error', () => {
                const input = { username: '', email: 'test@test.com' }
                const error = { message: 'Username is required', statusCode: 400 }

                expect.assertions(1)

                try {
                    validateFields(input)
                } catch (err) {
                    expect(err).toEqual(error)
                }
            })
        })

        describe('when the field is blank', () => {
            it('returns an error', () => {
                const input = { username: '   ', email: 'test@test.com' }
                const error = { message: 'Username is required', statusCode: 400 }

                expect.assertions(1)

                try {
                    validateFields(input)
                } catch (err) {
                    expect(err).toEqual(error)
                }
            })
        })
    })
})
