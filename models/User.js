const {DataTypes} = require('sequelize')
const sequelize = require('../db/db.js')
const bcrypt = require('bcrypt')

const User = sequelize.define('user',{
    id :{
        primaryKey : true,
        type : DataTypes.STRING,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING(64),
        allowNull : true
    },
    email:{
        type : DataTypes.STRING(128),
        allowNull : false,
        validate :{
            isEmail : true,
        },
        unique : true
    },
    password:{
        type : DataTypes.STRING(64),
        allowNull : false
    }
})

User.beforeCreate(async (user) => {
    const saltRounds = 5
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)
    user.password = hashedPassword
})

User.findByCredentials = async function(email,password){
    const user = await User.findOne({where:{email}})
    if(!user){
        throw new Error('Login Error, No User Found')
    }
    const isMatch = bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Password Mismatched')
    }

    delete user.password

    return user
}

module.exports = User