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
const config_1 = require("./config");
const db_2 = require("./db");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
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
        const token = jsonwebtoken_1.default.sign({ id: existinguser._id }, config_1.JWT_PASSWORD);
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
app.delete("/api/v1/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.post(" /api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
