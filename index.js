const express = require("express")
const app = express()
const authRoute = require("./routes/auth")
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const postRoute =require("./routes/post")
const cors = require('cors')
const usersRoute = require("./routes/users")
const terminalsRoute = require("./routes/terminals")
// const User = require('./model/User')
// const Clinic = require('./model/Clinic')

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
        console.log("connected to db")
    })
app.use("/api/user", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/users", usersRoute)

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const test = async function () {
//     let user = await User.findById("5e9122c85ce2627044323a7d")
//     const clinic = await Clinic.findById("5ea66efbfb810a92cc3219a3")
//     //clinic.users.push(user)
//    // await clinic.save()
//     user.clinic = clinic
//     console.log("1=============")
//     console.log(user.clinic)
//     await user.save()
//     console.log("2=============")
//     user = await User.findById("5e9122c85ce2627044323a7d")
//     console.log(user)
//     const storedObject = await User
//         .findById("5e9122c85ce2627044323a7d")
//         .populate("clinic")
//         .exec()
//         .then(async(doc) => {
//             return doc
//         });
//     console.log("3=============")
//     console.log(storedObject)
//     const storedObjectNested = await User.findById("5e9122c85ce2627044323a7d")
//         .populate({path:"clinic",populate:[{path:"users"}]})
//         .exec()
//         .then(async(doc) => {

//             return doc
//         });
//         console.log("4=============")
//         console.log(JSON.stringify(storedObjectNested))
// }
// //headere
// test()

app.listen(3333, () => {
    console.log("server runing at port 3333")
})