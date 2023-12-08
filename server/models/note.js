const mongoose = require("mongoose");

const NoteScehma = new mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  updatedAt:{
    type:Date,
    default:Date.now()
  },

})

module.exports=new mongoose.model('Note',NoteScehma)