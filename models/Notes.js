const { type } = require('@testing-library/user-event/dist/type');
const mongoose=require('mongoose')
const { Schema } = mongoose;  // destructuring of schema from mongoose

const NotesSchema = new Schema({
  User:{
    type: Schema.Types.ObjectId,
    ref:'users'

  },
  title:{
    type:"string",
  },
  description:{
    type:"string",
  },
  tag:{
    type:"string",
  },
  date:{
    type:Date,
    default:Date.now
  },
  from:{
    type:"string",
    default:""
  }
});
const Notes=mongoose.model("notes",NotesSchema)
module.exports=Notes;