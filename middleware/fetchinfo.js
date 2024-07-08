const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sec_key = "hiIAmGurmeetSingh"
const fetchInfo=(req,res,next)=>{
    const Auth_token=req.header('authToken')
 if(!Auth_token){
    res.status(401).json({error:"please authenticate using a valid token"})
 }
 try {
 const data=jwt.verify(Auth_token,sec_key)
 req.User=data.User
 next()
    
 } catch (error) {
    console.log(error)
    
 }


}

module.exports=fetchInfo