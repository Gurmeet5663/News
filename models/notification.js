const mongoose=require("mongoose")
const {Schema}=mongoose
const NotificationSchema=new Schema(
{
    User:{
        type: Schema.Types.ObjectId,
        ref:'user'
    
      },
      title:{
        type:"string"
      },
      description:{
        type:"string"
      },
      tag:{
        type:"string"
      },
      date:{
        type:Date,
        default:Date.now
      },
      message:{
        type:"string",
        default:""
      },
      from:{
        type: Schema.Types.ObjectId,
        ref:'user'
    
      }

}
)

const Notification=mongoose.model("Notification",NotificationSchema)
module.exports=Notification