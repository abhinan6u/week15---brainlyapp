"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
mongoose_1.default.connect("mongodb+srv://abhinan6u:c2jWBWmbcXfFUeLW@cluster0.g44ge.mongodb.net/brainly");
const userSchema = new mongoose_2.Schema({
    username: { type: String, required: true },
    password: String
});
exports.userModel = (0, mongoose_2.model)("User", userSchema);
const contentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tag" }],
    userid: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true }
});
exports.contentModel = (0, mongoose_2.model)("Content", contentSchema);
