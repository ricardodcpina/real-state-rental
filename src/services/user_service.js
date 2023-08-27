const { isValidObjectId } = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const models = require('../models')
const errors = require('../errors')
const config = require('../config') // Create env variables!

////////////////////////  Auxiliary Functions  /////////////////////////

const validateFields = (input) => {

    // Check for undefined and blank fields
    for (let field in input) {

        let fieldValue = String(input[field])
        if (!fieldValue || fieldValue.trim() === '') {
            throw {
                message: `${field.toUpperCase()} is required`,
                statusCode: 400
            }
        }
    }

    return true
}

const verifyEmail = async (email) => {

    // Check email is unique
    const user = await models.User.findOne({
        email,
        deletedAt: { $exists: false }
    })

    if (user) throw errors.emailNotUnique

    // Check email for correct formatting
    let regex = RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    if (!regex.test(email)) throw errors.emailnotFormatted

    return true
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, config.SALT)
}

const generateToken = (userId) => {
    return jwt.sign({ sub: userId }, config.JWT_SECRET, { expiresIn: '600s' })
}

////////////////////////  Main Functions  //////////////////////////////

exports.createUser = async (username, email, password) => {

    // Validate required fields
    validateFields({ username, email, password })

    // Checks email formatting and availability
    await verifyEmail(email)

    // Apply encryption to password
    const cryptedPassword = await hashPassword(password)

    // Save user on database
    const input = { username, email, password: cryptedPassword }
    const user = await models.User.create(input)

    return user
}

exports.authUser = async (username, password) => {

    // Validate input fields
    validateFields({ username, password })

    // Checks username existence

    const user = await models.User.findOne({
        username,
        deletedAt: { $exists: false }
    })

    if (!user) throw errors.notAuthenticated

    // Apply encryption and check authenticity
    if (await hashPassword(password) !== user.password)
        throw errors.notAuthenticated

    // Authenticate
    const token = generateToken(user._id)

    return { authenticated: true, token }
}

exports.updateUser = async (id, input) => {

    // Checks Object ID validity
    if (!isValidObjectId(id)) throw errors.invalidID

    // Checks for user ID
    const user = await models.User.findOne({
        _id: id,
        deletedAt: { $exists: false }
    })
    if (!user) throw errors.invalidID

    // Filter required fields for validation
    const { username, email, password } = input
    const inputFilter = { username, email, password }

    // Validate provided fields
    validateFields(inputFilter)

    // If provided, check email uniqueness only when comparing to other users
    if (input.email && (input.email !== user.email)) {
        await verifyEmail(input.email)
    }

    // Apply encryption to new password if provided
    if (input.password) {
        input.password = await hashPassword(input.password)
    }

    // Update user data on database
    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { ...input }, { new: true })

    return updatedUser
}

exports.findUser = async (id) => {

    // Check ID validity
    if (!isValidObjectId(id)) throw errors.invalidID

    // Checks for user ID
    const user = await models.User.findOne({
        _id: id,
        deletedAt: { $exists: false }
    })

    if (!user) throw errors.invalidID

    return user
}

exports.listUsers = async () => {
    return await models.User.find({ deletedAt: null })
}

exports.softDeleteUser = async (id) => {

    // Check ID validity
    if (!isValidObjectId(id)) throw errors.invalidID

    // Checks for user ID
    const user = await models.User.findOne({
        _id: id,
        deletedAt: { $exists: false }
    })

    if (!user) throw errors.invalidID

    // Add deletedAt field to user
    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { deletedAt: Date.now() }, { new: true })

    return updatedUser
}

exports.generateSALT = async () => {
    const SALT = await bcrypt.genSalt()

    return SALT
}

exports.validateFields = validateFields

exports.verifyEmail = verifyEmail

