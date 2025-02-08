"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const usermiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    // @ts-ignore
    const decode = jsonwebtoken_1.default.verify(header, JWT_PASSWORD);
    if (decode) {
        //@ts-ignore
        req.userId = decode.id;
        next();
    }
    else {
        res.status(303).json({ message: "You are not logged in" });
    }
};
exports.usermiddleware = usermiddleware;
