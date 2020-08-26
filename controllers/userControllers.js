// controllers/userControllers.js

const router = require('express').Router()
const FbUser = require('../utils/FbUser.js')
const User = require('../models/users.js')


router.post('/', (req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const newUser = new FbUser()

    // createUser is asyncronous method related to 
    // FbUser class. 3rd parameter is a callback function
    // the returns the user id in case of success, an
    // error message in case of error
    
    newUser.createUser(username, password, (error, id)=>{
        if(username && password){
            if(id){
                res.json(id)
            } else {
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(400)             // BAD REQUEST
        }
    })
})

router.get('/', (req, res)=>{
    const username = req.query.username
    const regex = req.query.regex
    const user = new FbUser()
    
    // checking the query to undestand if this will be a partial search 
    // or a full search by name

    if(username){
        user.getUserByUsername(username, (err, user)=>{
            if(user){
                res.json(user)
            } else {
                res.sendStatus(500)
            }
        })
    } else if(regex){
        user.returnPartialSearch(regex, (err, users)=>{
        if(users){
            res.json(users)
        } else {
            res.sendStatus(404)
        }         
        })
    }
})

router.get('/:id', (req, res)=>{
    if(req.params.id){
        const user = new FbUser()
        user.getUserById(req.params.id, (err, user)=>{
            if(user){
                res.json(user)
            } else {
                res.sendStatus(500)
            }
        })
    } else {
        res.sendStatus(500)
    } 
})

// PUT REQUEST, UPDATE ENTRY DB

router.put('/:id', (req, res) => {
    data = req.body
    id = req.params.id
    console.log(data, id)               // TODO: CLEAN THE INPUT BEFORE REQ TO DB
    const user = new FbUser()
    user.updateUser(id, data, (err, user)=>{      // returns the updated user
        if(id){
            res.json(user)
        } else {
            res.sendStatus(400)
        }
    })
})


// getUserById CRASH THE SERVER IF IT CANT FIND A VALID ID NEEDS TO BE FIXED
// edit - FIXED but would be nice to create error messages for each type of error

router.get('/:id/edit', (req, res)=>{
    console.log('here we are')
    try{
        user.getUserById(req.params.id, (err, user)=>{
            if(user){
                res.json(user)
            } else {
                res.sendStatus(500)
            }
        })
    } catch(err) {
        res.sendStatus(500)
    }
})

router.delete('/:id', (req, res)=>{
    const idToClean = req.query.clean
    console.log('clean? :',idToClean)
    if(idToClean!=='owner'){
        console.log('CLEAN MODE', idToClean)
        const user = new FbUser()
        user.cleanDeletedFriend(req.params.id, idToClean, (err, data)=>{
            if(data){
                res.json({ success: true })
            } else {
                res.json({ sucess: false })
            }
        })
    } else if(idToClean==='owner'){
        User.findByIdAndDelete(req.params.id, (err, data)=>{
            if(data){
                res.json({ success: true, deletedUser: data.username })
            } else {
                console.log(err)
                res.sendStatus(404)
            }
        })
    } else {
        res.json({ success: false , message: 'not a valid mode' })
    }
})



module.exports = router