import express from "express";
import jwt from "jsonwebtoken";
import { userModel } from "./db";
import mongoose from "mongoose";
import "dotenv/config";
import { contentModel } from "./db";
import { usermiddleware } from "./middleware";


const app = express()
const JWT_PASSWORD = process.env.JWT_PASSWORD;
app.use(express.json())
app.post("/api/v1/signup",async(req,res)=>{
    //zod validation && hash the password
    const username = req.body.username;
    const password = req.body.password;

    await userModel.create({
        username : username,
        password : password
    })

    res.json({
        message : "User signed Up"
    })
})

app.post("/api/v1/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const existinguser = await userModel.findOne({
        username,
        password
    })
    if(existinguser){
        //@ts-ignore
        const token = jwt.sign({id:existinguser._id},JWT_PASSWORD)
        res.json({
            token
        })
    }
    else{
        res.status(411).json({message : "invalid credentials"})
    }

})

app.post("/api/v1/content",usermiddleware,async(req,res)=>{
    const title = req.body.title;
    const link = req.body.link;

    await contentModel.create({
        title,
        link,
        //@ts-ignore
        userid:req.userId,
        tags : []

    })

    res.json({message : "Content added"})

})

app.get("/api/v1/content",usermiddleware,async(req,res)=>{
    //@ts-ignore
    const userid = req.userId;
    const content = await contentModel.find({userid:userid}).populate("userid","username")
    res.json({content})
})
app.delete("/api/v1/content",(req,res)=>{

})


app.post("/api/v1/brain/share",(req,res)=>{

})

app.post(" /api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000);