const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sec_key = "hiIAmGurmeetSingh"
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User')
const fetchInfo=require("../middleware/fetchinfo")

//------------------------->endpoint for create User<-------------------------------

router.post("/createuser", [
    // validations apply here                                          
    body("name", "name has some error").isLength({ min: 0 }),
    body("email", "enter a valid email").isEmail(),
    body("passward", "enter a valid passward").isLength({ min: 2 })
]
    , async (req, res) => {
        const result = validationResult(req);
        // in the result.array we will get an array of objects in which all the realted info. about the error is spacified as key valu pairs
        if (!result.isEmpty()) {
            res.send({ errors: result.array() });   //if the result is not empty means it has error so it  will show array of objects
        }

        // if the result is empty then do this

        try {
           
            // authentication  of user
            let User1 = await User.findOne({ email: req.body.email })   //User1 is an object whose email is same as the email of req.body
            if (User1) {                                             // if user exist show an error
                res.json({success:false, error: "user already exist" })
                console.log("user already exist")
            }                                                        // if not creat a new user
            else {
                
                const salt = await bcrypt.genSalt(10)
                const secpass = await bcrypt.hash(req.body.passward, salt)
                const User2 = await User.create({
                    native:req.body.native,
                    name: req.body.name,
                    email: req.body.email,
                    passward: secpass
                })
                console.log("new user is created")
                const data = {
                    User: {
                        id: User2._id
                    }
                }
                var authtoken = jwt.sign(data, sec_key);
                res.json({success:true, authtoken })

            }

         

        } catch (error) {                                       //catch the error
            console.log(error)
        }


    })


// --------------------------------------->end point for login<------------------------

router.post("/login", [
    body("email", "enter a valid email").isEmail(),
    body("passward", "enter a correct passward").exists()
],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.send({ errors: result.array() });
        }


        try {
            // res.json({ oK: "ok" })

            // console.log("ok")


            const { passward, email } = req.body
            const User1 = await User.findOne({ email })
            var success=false;
            if (!User1) {
                res.json({ success, error: "please enter a valid email" })
            }
      else{
            const comparePass = await bcrypt.compare(passward, User1.passward)
            if (!comparePass) {
                res.json({ success, error: "passward not matched" })
            }
            else {
                success=true
                console.log("User varified")
                const data={
                    User:{
                        id:User1._id
                    }
                }
                const authtoken=jwt.sign(data,sec_key)
                res.json({success,authtoken})
            }


        }} catch (error) {
            console.error(error)
        }


    })


    // route for User getdata

    router.post("/getdata",fetchInfo, async(req, res)=>{
        
try {
    const User1=await User.findById(req.User.id).select("-passward")
        res.json(User1)
} catch (error) {
    res.status(401).json({error:"internal server error"})
    console.log(error)
}


    })
//===========================>fetch all users<===================
router.post("/getallusers",fetchInfo, async(req, res)=>{
        
    try {
        const Users=await User.find({})
            res.json(Users)
    } catch (error) {
        res.status(401).json({error:"internal server error"})
        console.log(error)
    }
})

module.exports = router