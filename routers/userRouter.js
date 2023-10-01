const express = require('express')
const router = express.Router()
const { Snowflake } = require('@theinternetfolks/snowflake')


const postJson = require('../db/postJson')
const getJson = require('../db/getJson')
const createToken = require('../auth/createToken')
const auth = require('../auth/auth')
const User = require('../models/User')


router.post('/singup',async(req,res)=>{
    try{
        // SingingUp 

        const {name,email,password} = req.body
        const id = Snowflake.generate()
        const user = await User.create({id,name,email,password})
        const access_token = createToken(user)

        let resJson = postJson


        resJson["content"]["data"] = {id:user.id,name:user.name,email:user.email,createdAt:user.createdAt}
        resJson.meta = {access_token}
        
        res.send(resJson)

    }catch(err){
        res.status(400).send(err)
    }

})

router.post('/signin',async(req,res)=>{
    try{
        //Signing In 

        const {email,password} = req.body
        const user = await User.findByCredentials(email,password)
        const access_token = createToken(user)
        
        let resJson = postJson

        resJson["content"]["data"] = {id:user.id,name:user.name,email:user.email,createdAt:user.createdAt}
        resJson.meta = {access_token}

        res.cookie('access_token',access_token)

        res.send(resJson)

    }catch(err){
        res.status(400).send('Login Failed ')
    }
})

router.get('/me',auth,async(req,res)=>{
    try{
        const user = req.user
        let resJson = getJson

        resJson["content"]["data"] = {id:user.id,name:user.name,email:user.email,createdAt:user.createdAt}
        delete resJson["content"]["meta"]
        res.send(resJson)
    }catch(err){
        res.status(400).send(err)
    }

})



module.exports = router