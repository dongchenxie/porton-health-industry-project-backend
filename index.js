const express = require("express")
const app = express()
const authRoute = require("./routes/auth")
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const postRoute =require("./routes/post")
const cors = require('cors')

const swaggerOptions={
    swaggerDefinition: {
        info:{
            title:"my api",
            description:"description api",
            contact:{
                name:"me"
            }
        },
        basePath: '/api/user',
    },
    apis:["./routes/auth.js"]
}


app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
dotenv.config()


mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true,useUnifiedTopology: true },
    () => {
        console.log("connect to db")
    })
app.use("/api/user", authRoute)
app.use("/api/posts", postRoute)

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3333, () => {
    console.log("server runing at port 3333")
})