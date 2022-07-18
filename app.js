const dotenv= require('dotenv')
const cors = require('cors')
const express=require('express')
const db = require('./config/connectdb')
const userRouter=require("./routes/userRoutes.js")
dotenv.config()

const app=express()
const port = '3000'; //process.env.PORT
app.use(cors())

// from json
app.use(express.json())
//load routes
app.use("/api/user",userRouter)
app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`);
})