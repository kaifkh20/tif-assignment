const {DataTypes} = require('sequelize')
const sequelize = require('../db/db.js')

const Role = sequelize.define('role',{
    id :{
        primaryKey : true,
        type : DataTypes.STRING,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING(64),
        allowNull : false
    }
})

module.exports = Role