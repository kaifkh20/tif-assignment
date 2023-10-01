const server = require('../routers/app')

const PORT = process.env.PORT || 3000

require('dotenv').config()

server.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})