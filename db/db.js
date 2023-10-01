const {Sequelize} = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.SERVER_NAME,process.env.DB_USER,
                                process.env.DB_PASSWORD,
    {
    host : 'localhost',
    port : 5432,
    dialect : 'postgres',
    logging : false
})

sequelize.sync()

module.exports = sequelize