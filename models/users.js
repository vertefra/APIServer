// models/users.js

const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: false },
    state: { type: String, required: false },
    profile_img: { type: String, default: '/img/default_profile.png'},  /// add a default path for img
    isAdmin: { type: Boolean, default: false },
    isLogged: {type: Boolean, default: false },
    isAuth: {type: Boolean, default: false },
    posts: [
        { 
            id: { type: mongoose.Schema.Types.ObjectId },
            content: { type: String, required: true },
            likes: { type: Number, default: 0 },
            whoLikes: [
                { type: String } 
            ], 
            tags: { type: String, required: false },
            createdAt: { type: Date }
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend"
        }
    ],
    favouriteFoods: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "fovouriteFood"
        }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User