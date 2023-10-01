const jwt = require('jsonwebtoken')
const Commmunity = require("../models/Community")

const authAdmin = async(req,res,next)=>{
    try{
        const userId = req.user.id
        const communities = await Commmunity.findAll({where:{owner:userId}})

        if(communities.length === 0){
            throw new Error('No Admin Access to Any Community')
        }

        req.communities = communities
        next()

    }catch(e){
        res.status(400).send('NOT_ALLOWED_ACCESS')
    }
}

module.exports = authAdmin