const express = require('express')
const router = express.Router()
const { Snowflake } = require('@theinternetfolks/snowflake')

const postJson = require('../db/postJson')
const getJson = require('../db/getJson')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
const Member = require('../models/Member')
const Role = require('../models/Role')

router.post('/',auth,authAdmin,async(req,res)=>{
    try{

        // Creating A Member

        const id = Snowflake.generate()
        const communities = req.communities

        const {user,role} = req.body
        const communityId = req.body.community
        communities.forEach(community => {

            if(!community.id===communityId){
                throw new Error('NOT_ALLOWED_ACCESS')
            }
        })
        const member = await Member.create({id,community : communityId,user,role})
        
        let resJson = postJson

        resJson["content"]["data"] = member

        res.send(resJson)

    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/:id',auth,async(req,res)=>{
    try{
        // Community of the one being deleted
        const id = req.params.id
        let commOfDeleted = await Member.findOne({where:{id}})
        commOfDeleted = commOfDeleted.community
      
        // the one deleting
        const user = req.user

        // Checking For Privellege

        const privilleged = await Member.findOne({user})
        const role = await Role.findOne({where:{id:privilleged.role}})
        
        if(role["name"]==='Community Moderator' || role["name"]==='Community Admin' && commOfDeleted===privilleged.community){
            await Member.destroy({where:{id}})

            // Sending The Response

            return res.json({status:true})
        }
        
        throw new Error("NOT_ALLOWED_ACCESS")


    }catch(err){
        res.status(400).send(err)
    }
})


module.exports = router