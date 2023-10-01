const {DataTypes} = require('sequelize')
const sequelize = require('../db/db.js')
const User = require('./User.js')
const Commmunity = require('./Community.js')
const Role = require('./Role.js')


const Member = sequelize.define('member',{
    id:{
        type : DataTypes.STRING,
        primaryKey : true,
        allowNull : false
    },
    community : {
        type : DataTypes.STRING,
        references : {
            model : Commmunity,
            key : 'id'
        }
    },
    user : {
        type : DataTypes.STRING,
        references : {
            model : User,
            key : 'id'
        }
    },
    role:{
        type : DataTypes.STRING,
        references : {
            model : Role,
            key : 'id'
        }
    }
})


module.exports = Member