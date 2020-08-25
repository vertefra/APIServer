
// takes a req from a controller and return 2 parameters 
// url form /user/:id/friend/:id

const FbUser = require("./FbUser")
const User = require("../models/users")
const { ForecastService } = require("aws-sdk")

const returnParams = (req) =>{
        const URL = req.originalUrl.split('/')
        return [URL[2],URL[4]]
}

const getFriendsPosts = (id, cb) => {
    const feed = [] 
    User.findById(id, (err, friendsArray)=>{
        if(friendsArray){
            // data.friends contains all the friends id as an rray
            // data._id is the _id that shoul be equal to id
            const [ ...friendsIDs ] = friendsArray.friends
            // for every friend is I want to retrieve:
            // posts
            // username
            // profile_img
            // also I want to set a limit for the asyncrounous operation 
            const limit = friendsIDs.length
            for(let id of friendsIDs){
                User.findById(id, (err, user)=>{
                    if(user){
                        feed.push(user)
                        if(feed.length>=limit){
                            return cb(undefined, feed)
                        }
                    }
                }).select('posts username profile_img _id')
            }
        } else {
            return cb(err, undefined)
        }
    }).select('friends')
}


const createFeed = (id, cb) => {
    const feed = []
    getFriendsPosts(id, (err, arrayOfPosts)=>{
        if(arrayOfPosts){
            for(let entry of arrayOfPosts){
                for(let post of entry.posts){
                    const feedObj = {
                        owner_id: entry._id,
                        owner: entry.username,
                        profile_img: entry.profile_img,
                        likes: post.likes,
                        whoLikes: post.whoLikes,
                        _id: post._id,
                        content: post.content,
                        tags: post.tags,
                        createdAt: post.createdAt
                    }
                    feed.push(feedObj)
                }
            }
            return cb(undefined, feed) 
        } else {
            return cb(err, undefined)
        }
    })
}

const sortFeed = (feed) => {
    feed.sort((first, second)=>{
        if(first.createdAt<second.createdAt){
            return -1
        } else {
            return 1
        }
    })
    return feed
}

module.exports = { returnParams, getFriendsPosts, createFeed, sortFeed }


