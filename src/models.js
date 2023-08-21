const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    deletedAt: Date
})

exports.User = mongoose.model('User', UserSchema)

const HouseSchema = new mongoose.Schema({
    description: String,
    price: Number,
    available: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

exports.House = mongoose.model('House', HouseSchema)

const ReserveSchema = new mongoose.Schema({
    date: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House"
    }
})

exports.Reserve = mongoose.model("Reserve", ReserveSchema)