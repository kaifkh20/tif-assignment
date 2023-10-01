const jwt = require('jsonwebtoken')

require('dotenv').config()

function createToken(user){
    const token = jwt.sign({email:user.email,password:user.password},process.env.SECRET_KEY)
    return token
}


module.exports = createToken