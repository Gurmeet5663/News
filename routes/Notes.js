const express=require('express');
const router=express.Router();
const User = require('../models/User');
const Notes=require("../models/Notes")
const { body, query, validationResult } = require('express-validator');
const fetchInfo=require("../middleware/fetchinfo");

// ------------------------------------------------->end point for add notes<------------------------------
router.post("/addnotes",fetchInfo,[
    body("title","enter valid title").isLength({min:0}),
    body("description","enter a valid description").isLength({min:0})
], async(req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.send({ errors: result.array() });   
    }
try {
    const {title , description,tag}=req.body
    const Notes1= await Notes.create({title,description,tag,User:req.User.id}) 
    res.json(Notes1)
} catch (error) {
    res.json({message:"internal server error"})
}


})

// ------------------------------------------------------->end point for get notes<---------------------------------------
router.get("/getnotes",fetchInfo,async(req,res)=>{
    try {
        const userid=req.User.id;
      const notes1=await Notes.find({User:userid}).select("-User");
      res.json(notes1);

    } catch (error) {
        console.log(error)
    }
    
})

//--------------------------------------end point for updating notes----------------------------------------
router.put("/updatenotes/:id",fetchInfo, async(req,res)=>{             //here id is the id of the specific note
    try {
        //destructuring and pull out what in the req.   
    const {title,description,tag}=req.body;
    // make an empty object and keep ready the newnotes that we wanted to be replace with.
         const newnotes={};
         if(title){newnotes.title=title} ;
         if(description){newnotes.description=description} ;
         if(tag){newnotes.tag=tag} ;
    // search weather the note with the id in "/updatenotes/:id" present in the database or not.
    
    const note =await Notes.findById(req.params.id);
    //if the note is not present the show not find error
    //if it is present then do the varification . match the user id in the note to the id in the authtoken
    if(!note){return res.status(401).send(" note not found")}
    if (note.User.toString() !== req.User.id){
      res.status(401).send("Not Allowed")
    }
  // if the user if varified at the above criterias then update the notes
  const setnote=await Notes.findByIdAndUpdate(req.params.id,{$set:newnotes},{new:true})
  res.json(setnote)
    } catch (error) {
        console.log(error)
    }
 
})


//--------------------------------------end point for delete notes----------------------------------------
router.delete("/deletenote/:id",fetchInfo, async(req,res)=>{  

   try {
    const note=await Notes.findById(req.params.id)

    if(!note){return res.status(401).send(" note not found")}

    if (note.User.toString() !== req.User.id){
        res.status(401).send("Not Allowed")
      }
 const note1=await Notes.findByIdAndDelete(req.params.id)
 res.json({
    "sucess":"note is deleted sucessfully"
 })

   } catch (error) {
    console.log(error)
   }

 })
//--------------------------------------end point for delete All notes----------------------------------------
router.delete("/clearAll",fetchInfo,async(req,res)=>{
    try {
        const userid=req.User.id;
      const notes1=await Notes.deleteMany({User:userid});
      res.json(notes1);
      console.log("deleted all notes")
    } catch (error) {
        console.log(error)
    }
})

//--------------------------------------end point for share notes----------------------------------------
router.post("/sharenote/:nid/user/:uid",fetchInfo, async(req,res)=>{  

try {
    const note=await Notes.findById(req.params.nid)
    const {title,description,tag}=note
    const user=await User.findById(req.params.uid)
    const userid=user._id
    if(!note){return res.status(401).send(" note not found")}

    if (note.User.toString() !== req.User.id){
        res.status(401).send("Not Allowed")
      }
    
     const Notes1= await Notes.create({title,description,tag,User:userid}) 

 res.json({
    "sucess":"note is sheared sucessfully"
 })

} catch (error) {
    console.log(error)
}

 })


module.exports=router