const connectToMongo=require('./db')
const dotenv=require("dotenv")
var express = require('express')
var cors = require('cors')
var app = express()
dotenv.config()
connectToMongo()
app.use(express.json())
app.use(cors())
app.get('/',(req, res)=>{
    res.send("server started")
})
app.get('/about',(req,res)=>{
    res.send({new:"hello about"})
})
// app.use(express.static("./build"))
app.get("/",(req,res)=>{
    res.send("app first page")
})
app.use("/notes",require("./routes/Notes"))
app.use("/auth",require("./routes/Auth"))
app.use("/notification",require("./routes/notification"))

app .listen(process.env.PORT,'0.0.0.0',()=>{
    console.log(`listening at port ${process.env.PORT}`)
})



