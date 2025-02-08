import mongoose from "mongoose"; 
import {model,Schema}  from "mongoose";
import "dotenv/config"
//@ts-ignore
mongoose.connect(process.env.MONGODB_URI)
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


const linkSchema = new Schema({
    hash : String,
    userid : {type : mongoose.Types.ObjectId , ref : "User" , required : true }
})

export const linkModel = model("Link",linkSchema);
export const contentModel = model("Content",contentSchema);



