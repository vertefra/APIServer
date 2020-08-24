const mongoose = require ('mongoose')

const friendSchema = new mongoose.Schema({
    friend_id : { type: String, require: true, unique: true },
    friend_username: { type: String, require: true },
    friend_city: { type: String, require: false },
    food_in_common: [
        {type: String}
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    matchValue: { type: Number , default: 0}
})

const Friend = mongoose.model('Friend', friendSchema)

module.exports = Friend