const express = require("express")
const app = express()
const authRoute = require("./routes/auth")
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const postRoute =require("./routes/post")
const cors = require('cors')

app.use(cors())
app.use(express.json())

dotenv.config()


mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true,useUnifiedTopology: true },
    () => {
        console.log("connect to db")
    })


app.use("/api/user", authRoute)
app.use("/api/posts", postRoute)
app.listen(3333, () => {
    console.log("server runing at port 3333")
})