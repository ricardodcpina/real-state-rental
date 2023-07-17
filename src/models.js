const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    deletedAt: Date
})

exports.User = new mongoose.model('User', UserSchema)

