const router = require('express').Router()
const returnParams = require('../utils/utlis.js')
const FbUser = require('../utils/FbUser.js')

// POST post :)

router.post('/', (req, res)=>{
    const id = returnParams(req)[0]
    const postContent = req.body.postContent
    const user = new FbUser()
    user.addPost(id, postContent, (err, data)=>{
        if(data){
            res.json(data)
        } else {
            res.sendStatus(500)
        }
    })

})

router.get('/', (req, res)=>{
    const id = returnParams(req)[0]
    const user = new FbUser()
    user.getPosts(id, (err, data)=>{
        if(data){
            res.json(data)
        } else {
            res.sendStatus(404)
        }
    })
})

// EDIT POST CONTENT

router.put('/:postId/edit', (req, res)=>{
    const [ postOwnerId, postId ] = returnParams(req)
    const postContent = req.body.postContent
    const user = new FbUser()
    user.updatePost(postOwnerId, postId, postContent, (err, data)=>{
        if(data){
            res.json({action: 'modified', data:data})
        } else {
            res.sendStatus(500)
        }
    })

})

// Edit Likes Put route

router.put('/:postId', (req, res)=>{
    [ postOwnerId, postId ] = returnParams(req)
    const userWhoLikesId = req.body.userId
    // console.log(postOwnerId)
    // console.log(postId)
    // console.log(userWhoLikesId)
    const user = new FbUser()
    user.toggleLike(postOwnerId, postId, userWhoLikesId, (err, data)=>{
        if(data){
            res.json(data)
        } else {
            res.json(err)
        }
    })
})

router.delete('/:postId', (req, res)=>{
    [ postOwnerId, postId ] = returnParams(req)
    const user = new FbUser()
    user.deletePost(postOwnerId, postId, (err, data)=>{
        if(data){
            res.json(data)
        } else {
            res.json(err)
        }
    })

})

module.exports = router