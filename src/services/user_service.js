const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const models = require('../models')
const errors = require('../errors')
const config = require('../config')
const jwt = require('jsonwebtoken')

exports.authUser = async (username, password) => {

    if (!username || username.trim() === "") {
        throw errors.usernameRequired
    }

    if (!password || password.trim() === "") {
        throw errors.errors
    }

    const user = await models.User.findOne({ username })

    if (!user || user.deletedAt) throw errors.invalidCredentials

    if (await hashPassword(password) !== user.password) {
        throw errors.invalidCredentials
    }

    const token = generateToken(user._id)

    return { authenticated: true, token }
}

exports.createUser = async (username, email, password) => {

    if (!username || username.trim() === "") {
        throw errors.usernameRequired
    }

    if (!email || email.trim() === "") {
        throw errors.emailRequired
    }

    if (!password || password.trim() === "") {
        throw errors.passwordRequired
    }

    const emailExists = await findByEmail(email)

    if (emailExists) throw errors.emailIsUnique

    const cryptedPassword = await hashPassword(password)

    const newUser = new models.User({ username, email, password: cryptedPassword })

    return await newUser.save()
}

exports.listUsers = async () => {
    return await models.User.find({ deletedAt: null })
}

exports.findUser = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({
        _id: id
    })

    if (!user || user.deletedAt !== undefined) throw errors.invalidID

    return user
}

exports.updateUser = async (id, input) => {

    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({ _id: id })

    if (!user || user.deletedAt !== undefined) throw errors.invalidID

    const emailExists = await findByEmail(input.email)

    if (emailExists) throw errors.emailIsUnique

    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { ...input }, { new: true })

    return updatedUser
}

exports.softDeleteUser = async (id) => {

    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({ _id: id })

    if (!user || user.deletedAt !== undefined) throw errors.invalidID

    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { deletedAt: Date.now() }, { new: true })

    return updatedUser
}

exports.generateSALT = async () => {
    const SALT = await bcrypt.genSalt()

    return SALT
}

/////////////////////////////////////////////////////////////////////////////////

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