const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
   googleID:{
    type:String,
    required:true
   },
   displayName:{
    type:String,
    required:true
   },
   firstName:{
    type:String,
    required:true
   },
   LastName:{
    type:String,
    required:true
   },
   photos:{
    type:String,
    required:true
   }
})

module.exports = new mongoose.model("User",userSchema)