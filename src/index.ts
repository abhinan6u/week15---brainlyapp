import express from "express";
import jwt from "jsonwebtoken";
import { linkModel, userModel } from "./db";
import mongoose from "mongoose";
import "dotenv/config";
import { contentModel } from "./db";
import { usermiddleware } from "./middleware";
import { random } from "./utils";

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
app.delete("/api/v1/content",usermiddleware,async(req,res)=>{
    const contentId = req.body.contentId;
    await contentModel.deleteMany({
        contentId,
        // @ts-ignore
        userid : req.userId
    })
    res.json({message : "content deleted!!"})
})


app.post("/api/v1/brain/share",usermiddleware,async(req,res)=>{
    const share = req.body.share;
    if(share){
        const existingLink = await linkModel.findOne({
            userid : req.userId,
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await linkModel.create({
            userId: req.userId,
            hash: hash
        })

        res.json({
            hash
        })
    }
    else {
        await linkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        })
    }
})

app.get(" /api/v1/brain/:shareLink",async(req,res)=>{
    const hash = req.params.shareLink;

    const link = await linkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await contentModel.find({
        userId: link.userid
    })

    console.log(link);
    const user = await userModel.findOne({
        _id: link.userid
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

app.listen(3000);