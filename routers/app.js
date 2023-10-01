const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('../db/db.js')
const cookiesParser = require('cookie-parser')
const roleRouter = require('./roleRouter')
const userRouter = require('./userRouter.js')
const communityRouter = require('./communityRouter.js')
const memberRouter = require('./memberRouter.js')

const app = express()

app.use(bodyParser.json())
app.use(cookiesParser())
app.use('/v1',roleRouter)
app.use('/v1/auth',userRouter)
app.use('/v1/community',communityRouter)
app.use('/v1/member',memberRouter)

try{
    sequelize.authenticate()
    console.log(`Connection with Database Established`);
}catch(err){
    console.log(`Connection Not Established ${err}`);
}



module.exports = app