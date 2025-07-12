"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const database_1 = require("../config/database");
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const token = authHeader.replace("Bearer ", "");
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default-secret-key");
        const user = await database_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: userId });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.auth = auth;
