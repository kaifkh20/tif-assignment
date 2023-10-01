const jwt = require('jsonwebtoken')
const User = require("../models/User")

require('dotenv').config()

const auth = async(req,res,next)=>{
    try{
        const access_token = req.cookies.access_token
        const decoded = jwt.verify(access_token,process.env.SECRET_KEY)
        const user = await User.findOne({where:{email:decoded.email,password:decoded.password}})
        if(!user){
            throw new Error('No User Found')
        }
        
        req.user = user
        

        next()
    }catch(e){
        res.status(401).send('Not Authorized')
    }
}

module.exports = auth