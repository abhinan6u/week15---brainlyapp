import {Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
const JWT_PASSWORD = process.env.JWT_PASSWORD;
export const usermiddleware = (req:Request, res:Response , next : NextFunction)=>{
    const header = req.headers["authorization"];
    // @ts-ignore
    const decode = jwt.verify(header as string, JWT_PASSWORD);

    if (decode){
        //@ts-ignore

        req.userId = decode.id;
        next()
    }
    else{
        res.status(303).json({message : "You are not logged in"})
    }
}