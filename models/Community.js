const {DataTypes} = require('sequelize')
const sequelize = require('../db/db.js')
const User = require('./User.js')

const Commmunity = sequelize.define('community',{
    id:{
        primaryKey : true,
        type : DataTypes.STRING,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING(128),
        allowNull : false
    },
    slug :{
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
    owner : {
        type : DataTypes.STRING,
        references : {
            model : User,
            key : 'id'
        }
    }
})


module.exports = Commmunity