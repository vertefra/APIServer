const router = require('express').Router()
const FbUserd = require('../utils/FbFriend.js')
// const returnParams = require('../utils/utlis.js')
const upload = require('../services/fileUpload.js')
const singleImgUpload = upload.single('image'); // image is the key for the request

router.post('/', (req, res)=>{
    console.log('REQ.BODY',req.body)
    singleImgUpload(req, res, (err)=>{
        if(err){
            return res.sendStatus(404)
        } else {
            return res.json({'imageUrl': req.file.location})
        }
    })
}) 


module.exports = router