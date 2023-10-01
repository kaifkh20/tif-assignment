const express = require('express')
const router = express.Router()
const { Snowflake } = require('@theinternetfolks/snowflake')
const sluggenerate = require('slug')

const postJson = require('../db/postJson')
const getJson = require('../db/getJson')
const auth = require('../auth/auth')
const User = require('../models/User')
const Commmunity = require('../models/Community')
const Member = require('../models/Member')
const Role = require('../models/Role')

router.use(auth)

router.post('/',auth,async(req,res)=>{
    try{
        // Creating A Community
        const id = Snowflake.generate()
        const {name} = req.body
        const slug= sluggenerate(name)
        const owner = req.user.id
        const community = await Commmunity.create({id,name,slug,owner})

        // Creating member admin after finding the role id

        const memberId = Snowflake.generate()
        const role = await Role.findOne({where:{name:"Community Admin"}})
        const admin = await Member.create({id:memberId,community:id,user:req.user.id,role:role.id})
        
        // Modifying the response JSON

        let resJson = postJson
        resJson["content"]["data"] = community   
        
        res.send(resJson)

    }catch(err){
        res.status(400).send(`Not Able To Create A Community ${err}`)
    }
})

router.get('/',async(req,res)=>{
    try{
        // Finding The Community
        const communities = await Commmunity.findAll({attributes:['id','name','slug','owner','createdAt','updatedAt']})
        const length = communities.length

        // Modifying the Response JSON

        let resJson = getJson
    
        resJson["content"]["meta"]["total"] = length
        resJson["content"]["meta"]["page"] = 1
        resJson["content"]["meta"]["pages"] = Math.ceil(length/10.0)
        
        resJson["content"]["data"] = communities
        
        const lengthOfData = resJson["content"]["data"].length

        for(let i=0;i<lengthOfData;i++){
            // Populating the Owner 

            const owner = resJson["content"]["data"][i]["owner"]
            const {id,name} = await User.findByPk(owner)
            resJson["content"]["data"][i]["owner"] = {id,name}
        }

        res.send(resJson)
    
    }catch(err){
        res.status(500).send(`Cannout Fetch ${err}`)
    }
})

router.get('/:id/members',async(req,res)=>{
    const communityId = req.params.id
    try{
        // Finding The Members
        const members = await Member.findAll({attributes:{exclude:['updatedAt']},where:{community:communityId}},)
        const count = members.length

        //Modifying the Response 

        let resJson = getJson

        resJson["content"]["meta"]["total"] = count
        resJson["content"]["meta"]["page"] = 1
        resJson["content"]["meta"]["pages"] = Math.ceil(count/10.0)

        resJson["content"]["data"] = members

        const lengthOfData = resJson["content"]["data"].length

        
        for(let i=0;i<lengthOfData;i++){
            // Populating User
            const user = resJson["content"]["data"][i]["user"]
            const {id:userId,name:userName} = await User.findOne({attributes:['id','name'],where:{id:user}})
            resJson["content"]["data"][i]["user"] = {id:userId,name:userName}
            
            // Populating Role
            const role = resJson["content"]["data"][i]["role"]
            const {id:roleId,name:roleName} = await Role.findOne({attributes:['id','name'],where:{id:role}})
            resJson["content"]["data"][i]["role"] = {id:roleId,name:roleName}
        }
        res.send(resJson)
    }catch(err){
        res.status(500).send(`Couldn't Fetch Data ${err}`)
    }
})

router.get('/me/owner',async(req,res)=>{
    try{
        const ownerId = req.user.id
        const role = await Role.findOne({where:{name:"Community Admin"}})
        const communities = await Member.findAll({attributes:['community'],where:{user:ownerId,role:role.id}})
        

        const count = communities.length

        let resJson = getJson
        resJson["content"]["meta"]["total"] = count
        resJson["content"]["meta"]["page"] = 1
        resJson["content"]["meta"]["pages"] = Math.ceil(count/10.0)
        resJson["content"]["data"] = communities

        const lengthOfData = resJson["content"]["data"].length

        for(let i=0;i<lengthOfData;i++){
            // Populating Community
            const communityId = resJson["content"]["data"][i]["community"]
            let commInfo = await Commmunity.findOne({where:{id:communityId}})
            resJson["content"]["data"][i] = commInfo
        }
        res.send(resJson)
    }catch(err){
        res.status(500).send(`Cannot Fetch ${err}`)
    }

})

router.get('/me/member',async(req,res)=>{
    try{
        //Finding the Member with specified conditions. 

        const userId = req.user.id
        const role = await Role.findOne({where:{name:"Community Member"}})
        const communities = await Member.findAll({attributes:['community'],where:{user:userId,role:role.id}})
        

        const count = communities.length

        // Modifying Response

        let resJson = getJson
        resJson["content"]["meta"]["total"] = count
        resJson["content"]["meta"]["page"] = 1
        resJson["content"]["meta"]["pages"] = Math.ceil(count/10.0)
        resJson["content"]["data"] = communities

        const lengthOfData = resJson["content"]["data"].length

        for(let i=0;i<lengthOfData;i++){
            // Populating Community
            const communityId = resJson["content"]["data"][i]["community"]
            let commInfo = await Commmunity.findOne({where:{id:communityId}})
            resJson["content"]["data"][i] = commInfo

            // Populating Owner
            const ownerId = resJson["content"]["data"][i]["owner"]  
            const owner = await User.findOne({attributes:['id','name'],where:{id:ownerId}})
            resJson["content"]["data"][i]["owner"] = owner
        }
        res.send(resJson)
    }catch(err){
        res.status(500).send(`Cannot Fetch ${err}`)
    }
})

module.exports = router