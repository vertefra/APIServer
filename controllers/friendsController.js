const router = require('express').Router()
const FbFriend = require('../utils/FbFriend.js')
const returnParams = require('../utils/utlis.js')


router.post('/:friendId', (req, res)=>{
    const IDS = returnParams(req)
    const [ ownerID, friendID ] = IDS
    const friend = new FbFriend(ownerID, friendID)
    friend.createFriend((err, data)=>{ // createFriend add a friend document in the friend collection
        if(data){
            console.log('data from endpoint to frontend', data)
            res.json(data)
        } else {
            console.log(err)
        }
    })

})

router.delete('/:friendId', (req, res)=>{
    const IDS = returnParams(req)
    const [ ownerID, friendID ] = IDS
    const friend = new FbFriend(ownerID, friendID)
    friend.deleteFriend((err, data)=>{
        if(data){
            res.json(data)
        } else {
            res.json(err)
        }
    })
})

module.exports = router