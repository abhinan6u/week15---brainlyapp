"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
require("dotenv/config");
const db_2 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //zod validation && hash the password
    const username = req.body.username;
    const password = req.body.password;
    yield db_1.userModel.create({
        username: username,
        password: password
    });
    res.json({
        message: "User signed Up"
    });
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existinguser = yield db_1.userModel.findOne({
        username,
        password
    });
    if (existinguser) {
        //@ts-ignore
        const token = jsonwebtoken_1.default.sign({ id: existinguser._id }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(411).json({ message: "invalid credentials" });
    }
}));
app.post("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    yield db_2.contentModel.create({
        title,
        link,
        //@ts-ignore
        userid: req.userId,
        tags: []
    });
    res.json({ message: "Content added" });
}));
app.get("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userid = req.userId;
    const content = yield db_2.contentModel.find({ userid: userid }).populate("userid", "username");
    res.json({ content });
}));
app.delete("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_2.contentModel.deleteMany({
        contentId,
        // @ts-ignore
        userid: req.userId
    });
    res.json({ message: "content deleted!!" });
}));
app.post("/api/v1/brain/share", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.linkModel.findOne({
            userid: req.userId,
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.linkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield db_1.linkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get(" /api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.linkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = yield db_2.contentModel.find({
        userId: link.userid
    });
    console.log(link);
    const user = yield db_1.userModel.findOne({
        _id: link.userid
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(3000);
