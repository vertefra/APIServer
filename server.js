// IMPORT SETTINGS

const dotevn = require('dotenv')
dotevn.config()
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const PORT = process.env.PORT || 3001

// SERVER ENGINE INIT

const express = require('express')
const app = express()
// app.set('view engine', 'jsx')
// app.engine('jsx', require('express-react-views').createEngine())

// MIDDLEWARE

// cors

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// app.use(cors)

// MONDO DB CONNECTION

const URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-fg0dv.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
const mongoose = require('mongoose')
mongoose.connect(URI, 
    { 
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
mongoose.connection.once('open', ()=>{
    console.log('Server connected to Databse')
    console.log('DB_NAME: ', DB_NAME)
})

// CONTROLLERS

// STATIC


app.get('/', (req, res)=>{
    res.send({
        receive: true
    })
})

// '/user' controller // SHOULD BE PLURAL!!!! --> TODO: refactor everithing??

const userControllers = require('./controllers/userControllers.js')
app.use('/user',userControllers)

// '/friends controller

const friendControllers = require('./controllers/friendsController.js')
app.use('/user/:userId/friends', friendControllers)

// /posts controllers

const postsControllers = require('./controllers/postsControllers.js')
app.use('/user/:userId/posts', postsControllers)

app.listen(PORT, ()=>{
    console.log('server listening on port: ',PORT)
})

