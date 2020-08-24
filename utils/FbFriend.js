// utils/Friends.js
const FbUser = require ('./FbUser')
const Friend = require('../models/fiends.js')
const User = require('../models/users.js')

class FbFriend {
    constructor(
        owner_id,
        friend_id,
    ){
        this.owner_id = owner_id
        this.friend_id = friend_id
    }

    createFriend(cb){
        const friend = new FbUser()
        friend.getUserById(this.friend_id, (err, user)=>{
            if(user){
                Friend.create({ 
                    friend_id:user.id,
                    friend_username: user.username,
                    friend_city: user.city,
                    user: this.owner_id 
                }, (err, friend)=>{
                    if(friend){
                        this.addFriend((err, data)=>{
                            if(data){
                                return cb(undefined, friend)
                            } else {
                                return cb(err, undefined)
                            }
                        })
                    } else {
                        return cb(err, undefined)
                    }
                })
            } else {
                return err
            }
        })
    }

    deleteFriend(cb){
        Friend.findOneAndDelete({friend_id:this.friend_id}, (err, data)=>{
            console.log('data', data, err)
            if(data){
                console.log('data ',data)
                User.update({_id:this.owner_id}, {$pull: {friends: this.friend_id}}, (err, data)=>{
                    if(data){
                        return cb(undefined, data)
                    } else {
                        return cb(err, undefined)
                    }
                })
            } else {
                return cb(err, undefined)
            }
        })
    }

    addFriend(cb){
        User.update({_id: this.owner_id}, {$push: {friends: this.friend_id}}, (err, data)=>{
            console.log('adding friend', err, data)
            if(data){
                console.log('updated', data, err)
                return cb(undefined, data)
            } else {
                console.log('error', data, err)
                return cb(err, undefined)
            }
        })

    }
}

module.exports = FbFriend