const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    deletedAt: Date
})

exports.User = mongoose.model('User', UserSchema)

