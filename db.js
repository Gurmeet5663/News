const mongoose = require('mongoose')
const mongoUri="mongodb+srv://gmtisking:49ju8zNOXrQDzr8Q@cluster0.labjgep.mongodb.net/"
const connectToMongo = ()=>{
    mongoose.connect(mongoUri).then(
        console.log("mongoconneted")
    )
}
 
module.exports=connectToMongo;