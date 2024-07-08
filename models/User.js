const { type } = require('@testing-library/user-event/dist/type');
const mongoose=require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type:"string",
    required:true
  },
  email:{
    type:"string",
    required:true,
    unique:true,
  },
  native:{
    type:"string",
    required:true
    
  },
  passward:{
    type:"string",
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  },
});
const User=mongoose.model("user",UserSchema) //first argument is the collection name and the second argument is the name of 
module.exports=User