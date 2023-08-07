const userService = require('../src/services/user_service')

/* exports.softDeleteUser = async (id) => {

    // Check ID validity
    if (!mongoose.isValidObjectId(id)) {
        throw errors.invalidID
    }

    const user = await models.User.findById({ _id: id })

    if (!user || user.deletedAt !== undefined) throw errors.invalidID

    // Add deletedAt field to user
    const updatedUser = await models.User.findByIdAndUpdate(
        { _id: id }, { deletedAt: Date.now() }, { new: true })

    return updatedUser
} */