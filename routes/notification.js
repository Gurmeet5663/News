const express=require('express');
const router=express.Router();
const User = require('../models/User');
const Notes=require("../models/Notes")
const { body, query, validationResult } = require('express-validator');
const fetchInfo=require("../middleware/fetchinfo");
// const notification=require("../models/notification");
const Notification = require('../models/notification');



//--------------------------------------end point for share notes----------------------------------------
router.post("/notify/:nid/user/:uid",fetchInfo, async(req,res)=>{  

   try {
      const note=await Notes.findById(req.params.nid)
      const {title,description,tag}=note
      const user=await User.findById(req.params.uid)
      const userid=user._id
      
      if(!note){return res.status(401).send(" note not found")}
  
      if (note.User.toString() !== req.User.id){
          res.status(401).send("Not Allowed")
        }
      
       const Notes1= await Notification.create({title,description,tag,User:userid,message:req.body.message,from:req.User.id}) 
  
   res.json({
      "sucess":"note is sheared sucessfully to notification collection",Notes1
   })
   } catch (error) {
      console.log(error)
   }


 })
//======================================>fetching notifications<==============================
router.get("/notify/notification",fetchInfo,async(req,res)=>{
  try {
   const userid=req.User.id;
   const notes1=await Notification.find({User:userid}).select("-User");
   res.json(notes1);
  } catch (error) {
   console.log(error)
  }

})

//=========================>adding from notification to notes collection<========================

router.post("/notify/addnote/:nid",fetchInfo, async(req,res)=>{  

   try {
      const note=await Notification.findById(req.params.nid)
   const {title,description,tag,User,from}=note

   if(!note){return res.status(401).send(" note not found")}

   if (note.User.toString() !== req.User.id){
       res.status(401).send("Not Allowed")
     }
const note1=await Notes.create({title,description,tag,User,from})
const note2=await Notification.findByIdAndDelete(req.params.nid)
res.json(
   note1
)

   } catch (error) {
      console.log(error)
   }

})

//=========================>to delete a notification <========================

router.delete("/notify/deletenotification/:id",fetchInfo, async(req,res)=>{  

  try {
   const note=await Notification.findById(req.params.id)

   if(!note){return res.status(401).send(" note not found")}

   if (note.User.toString() !== req.User.id){
       res.status(401).send("Not Allowed")
     }
const note1=await Notification.findByIdAndDelete(req.params.id)
res.json({
   "sucess":"notification is deleted sucessfully"
})
  } catch (error) {
   console.log(error)
  }


})


module.exports=router