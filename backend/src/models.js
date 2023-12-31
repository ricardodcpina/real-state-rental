require('dotenv').config()
const PORT = process.env.PORT || 8000

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
    location: String,
    price: Number,
    available: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: { virtuals: true }
})

HouseSchema.virtual('thumbnail_url').get(function () {
    return `http://localhost:${PORT}/files/${this.thumbnail}`
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