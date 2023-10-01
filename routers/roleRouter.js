const express = require('express')
const router = express.Router()
const Role = require('../models/Role')
const { Snowflake } = require('@theinternetfolks/snowflake')

const postJson = require('../db/postJson')
const getJson = require('../db/getJson')

router.post('/role',async(req,res)=>{
    try{
        // Creating a Role

        const name = req.body.name
        const id = Snowflake.generate()
        const role = await Role.create({id,name})
        let resJson = postJson
        resJson["content"]["data"] = role

        res.send(resJson)

    }catch(err){
        res.status(400).send('Not Able To Create The Role')
    }
})

router.get('/role',async(req,res)=>{
    try{
        // Getting all the roles
        const roles = await Role.findAndCountAll()
        
        let resJson = getJson
        resJson["content"]["meta"]["total"] = roles["count"]
        resJson["content"]["meta"]["page"] = 1
        resJson["content"]["meta"]["pages"] = Math.ceil(roles["count"]/10.0)

        resJson["content"]["data"] = roles["rows"]

        res.send(resJson)
    }catch(err){
        res.status(500).send(`Not able to fetch ${err}`)
    }
})


module.exports = router