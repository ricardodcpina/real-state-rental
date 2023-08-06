const userService = require('../src/services/user_service')

describe("when the validation is successfull", () => {
    it("returns the updated user", async () => {
        
    })
})

/* exports.updateUser = async (id, input) => {

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
} */

