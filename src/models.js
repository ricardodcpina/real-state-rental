const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    deletedAt: Date
})

exports.User = model('User', UserSchema)

const HouseSchema = new Schema({
    thumbnail: String,
    description: String,
    price: Number,
    available: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

exports.House = model('House', HouseSchema)

const ReserveSchema = new Schema({
    date: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    house: {
        type: Schema.Types.ObjectId,
        ref: "House"
    }
})

exports.Reserve = model("Reserve", ReserveSchema)