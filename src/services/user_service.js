const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const models = require('../models')
const errors = require('../errors')
const config = require('../config')

exports.createUser = async (username, email, password) => {

    // Validate fields
    if (!username || username.trim() === "") {
        throw errors.usernameRequired
    }

    if (!password || password.trim() === "") {
        throw errors.passwordRequired
    }

    if (!email || email.trim() === "") {
        throw errors.emailRequired
    }

    const emailExists = await findByEmail(email)

    if (emailExists) throw errors.emailIsUnique

    // Apply encryption 
    const cryptedPassword = await hashPassword(password)

    // Save user on db
    const input = { username, email, password: cryptedPassword }

    const user = await models.User.create(input)

    return user
}

exports.authUser = async (username, password) => {

    // Validate fields
    if (!username || username.trim() === "") {
        throw errors.usernameRequired
    }

    if (!password || password.trim() === "") {
        throw errors.passwordRequired
    }

    const user = await models.User.findOne({ username })

    if (!user || user.deletedAt !== undefined) {
        throw errors.invalidCredentials
    }

    // Apply encryption and check authenticity
    if (await hashPassword(password) !== user.password) {
        throw errors.invalidCredentials
    }

    const token = generateToken(user._id)

    return { authenticated: true, token }
}

exports.listUsers = async () => {
    return await models.User.find({ deletedAt: null })
}

exports.findUser = async (id) => {

    // Check ID validity
    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({
        _id: id
    })

    if (!user || user.deletedAt !== undefined) {
        throw errors.invalidID
    }

    return user
}

exports.updateUser = async (id, input) => {

    // Check ID validity
    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({ _id: id })

    if (!user || user.deletedAt !== undefined) throw errors.invalidID

    // Validate fields
    if (!input.username || input.username.trim() === "") {
        throw errors.usernameRequired
    }

    if (!input.password || input.password.trim() === "") {
        throw errors.passwordRequired
    }

    if (!input.email || input.email.trim() === "") {
        throw errors.emailRequired
    }

    // Check email uniqueness only when comparing to other users
    if (input.email !== user.email) {

        const emailExists = await findByEmail(input.email)

        if (emailExists) throw errors.emailIsUnique
    }

    // Apply encryption to new password
    input.password = await hashPassword(input.password)

    // Update user data
    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { ...input }, { new: true })

    return updatedUser
}

exports.softDeleteUser = async (id) => {

    // Check ID validity
    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({ _id: id })

    if (!user || user.deletedAt !== undefined) {
        throw errors.invalidID
    }

    // Add deletedAt field to user
    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { deletedAt: Date.now() }, { new: true })

    return updatedUser
}

exports.hardDeleteUser = async (email) => {
    await models.User.deleteOne({ email })
}

exports.generateSALT = async () => {
    const SALT = await bcrypt.genSalt()

    return SALT
}

/////////////////////////////////////////////////////////////////////////////

const findByEmail = async (email) => {
    const user = await models.User.findOne({
        email,
        deletedAt: { $exists: false }
    })

    return user
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, config.SALT)
}

const generateToken = (userId) => {
    return jwt.sign({ sub: userId }, config.JWT_SECRET, { expiresIn: '300s' })
}