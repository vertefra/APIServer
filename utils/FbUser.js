// utils/FbUser.js

const User = require('../models/users.js')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const e = require('express')

class FbUser {
    constructor(
        first_name='first name',
        last_name='last name',
        username,
        password,
        city,
        state,
        profile_img='/img/default_profile.png',
        isAdmin=false,
        isLogged=false,
    ){
        this.first_name = first_name,
        this.last_name = last_name,
        this.username = username,
        this.password = password,
        this.city = city,
        this.state = state,
        this.profile_img = profile_img,
        this.isAdmin = isAdmin,
        this.isLogged = isLogged,
        this.posts = [],
        this.friends = [],
        this.favouriteFoods = []
    }

    returnUserObj(){
        return {
            first_name : this.first_name,
            last_name : this.last_name,
            username : this.username,
            city : this.city,
            state : this.state,
            profile_img : this.profile_img,
            isAdmin : this.isAdmin,
            isLogged : this.isLogged,
            posts : this.posts,
            friends : this.friends,
            favouriteFoods : this.favouriteFoods
        }
    }

    // insert a new user in the database and returns the mongo _id
    
    createUser(username, password, cb){
        this.username = username
        this.password = password
        User.create(this, (err, user)=>{
            return cb(err, user._id)
        })
    }

    getUserById(id, cb){
        console.log('id in getUser by id ', id)
        User.findById(id, (err, user)=>{
            if(user){
                console.log('user in get user by id', user)
                const userObj = {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    isAdmin: user.isAmin,
                    isLogged: user.isLogged,
                    isAuth: user.isAuth,
                    profile_img: user.profile_img,
                    favouriteFoods: user.favouriteFoods,
                    friends: user.friends,
                    posts: user.posts,
                    city: user.city,
                    state: user.state,
                }
                return cb(undefined, userObj)
            } else {
                return cb(err, undefined)
            }
        })
    }

    getUserByUsername(username, cb){
        try{
            User.findOne({username}, (err, user)=>{
                if(user){
                    const userObj = {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        username: user.username,
                        isAdmin: user.isAmin,
                        isLogged: user.isLogged,
                        isAuth: user.isAuth,
                        profile_img: user.profile_img,
                        favouriteFoods: user.favouriteFoods,
                        friends: user.friends,
                        posts: user.posts,
                        city: user.city,
                        state: user.state,
                        password: user.password
                    }
                    return cb(undefined, userObj)
                } else {
                    return cb(err, undefined)
                } 
            })
        } catch(err){
            return `Probably wrong username: ${username}`
        }
    }

    // partial serch is done by username. TODO: IMPLEMENT A SEARCH THAT WILL LOOK INTO first_name, last_name and username

    returnPartialSearch(regex, cb){
        try{
            User.find({username: {$regex: regex, $options: 'i'}}, (err, users)=>{
                if(users){
                    return cb(undefined, users)
                } else {
                    return cb(err, undefined)
                }
            }).select('_id username first_name last_name profile_img') // query to return only this fields
        } catch (error) {
            return `error in partial search in fbUser object: ${error}`
        }
    }

    updateUser(id, data, cb){
        try{
            User.findByIdAndUpdate({_id:id}, {...data},{runValidators:true}, (err, user)=>{
                if(user){
                    return cb(undefined, user)
                } else {
                    return cb(err, undefined)
                }
            })
        } catch(err){
            return `something wrong with the id or the data? ${id}, ${data}`
        }
    }

    addPost(userId, content, cb){
        // TODO: create a function that scrap the content and insert the tags
        // create in the front end the possibility to add tags
        const tags = ''
        const postObj = {
            content,
            tags,
            createdAt: Date.now()
        }
        User.findOneAndUpdate({_id: userId},{ $push: { posts: postObj }}, (err, data) => {
            if(data){
                return cb(undefined, data)
            } else {
                return cb(data, undefined)
            }
        })
    }

    getPosts(userId, cb){
        User.findOne({_id:userId}, (err, data)=>{
            if(data){
                return cb(undefined, data)
            } else {
                return cb(err, undefined)
            }
        }).select('posts')
    }

    // TOGGLE LIKE IS HELL.

    toggleLike(postOwnerId, postId, whoLikePostId, cb){
        User.findById(postOwnerId, (err, posts)=>{
            if(posts){
                const postsObj = JSON.parse(JSON.stringify(posts))
                const thisPost = postsObj.posts.find(post => post._id===postId.toString())
                const doIlikeIt = thisPost.whoLikes.includes(whoLikePostId)
                if(doIlikeIt){
                    this.removeLike(postOwnerId, postId, whoLikePostId, (err, res)=>{
                        if(res){
                            this.getPosts(postOwnerId,(err, data)=>{
                                const post = data.posts.find(post=>post._id.toString()===postId.toString())
                                return cb(undefined, { action: 'removes' , likes: post.likes })
                            })
                        } else {
                            return cb({ action: false }, undefined)
                        }
                    })
                } else {
                    this.addLike(postOwnerId, postId, whoLikePostId, (err, res)=>{
                        if(res){
                            this.getPosts(postOwnerId,(err, data)=>{
                                const post = data.posts.find(post=>post._id.toString()===postId.toString())
                                return cb(undefined, { action: 'added' , likes: post.likes })
                            })
                        } else {
                            return cb({ action: false }, undefined)
                        }
                    })
                }
            } else {
                console.log(err)
            }
        }).select('posts')
    }

    removeLike(postOwnerId, postId, whoLikePostId, cb){
        User.update({_id:postOwnerId, "posts._id": postId },
            { 
                "$pull": { "posts.$.whoLikes" : whoLikePostId},
                "$inc": { "posts.$.likes": -1 }
            },
            (err, data)=>{
                if(data){
                    return cb(undefined, data)
                } else {
                    return cb(err, undefined)
                }
            }
        )
    }
    
    addLike(postOwnerId, postId, whoLikePostId, cb){
        User.update({_id:postOwnerId, "posts._id": postId },
                    { 
                        "$push": { "posts.$.whoLikes" : whoLikePostId},
                        "$inc": { "posts.$.likes": 1 }
                    },
                    (err, data)=>{
                        if(data){
                            return cb(undefined, data)
                        } else {
                            return cb(err, undefined)
                        }
                    }
        )
    }

    deletePost(postOwnerId, postId, cb){
        User.update({_id:postOwnerId},
            { "$pull": { posts: { _id: postId} }}, (err, data)=>{
            if(data){
                this.getPosts(postOwnerId, (err, data)=>{
                    return cb(undefined, {action: 'removed', posts: data})
                })
            } else {
                return cb({action: 'failed to remove', error: err}, undefined)
            }
        })
    }

    updatePost(postOwnerId, postId, content, cb){
        User.update({_id:postOwnerId, "posts._id":postId },
            { "$set": { "posts.$.content": content}}, (err, data)=>{
                if(data){
                    console.log(data)
                } else {
                    console.log(err)
                }
            })
    }
}

module.exports = FbUser