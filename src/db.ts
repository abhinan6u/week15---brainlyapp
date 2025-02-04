import mongoose from "mongoose"; 
import {model,Schema}  from "mongoose";
mongoose.connect("mongodb+srv://abhinan6u:c2jWBWmbcXfFUeLW@cluster0.g44ge.mongodb.net/brainly")
const userSchema = new Schema({
    username : {type:String, required : true},
    password : String
})

export const userModel = model("User",userSchema)


const contentSchema = new Schema({
    title : String,
    link : String,
    tags : [{type:mongoose.Types.ObjectId , ref :"Tag"}],
    userid : {type : mongoose.Types.ObjectId, ref : "User",required : true}
    
})

export const contentModel = model("Content",contentSchema);