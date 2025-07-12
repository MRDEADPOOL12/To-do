"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword,
            name
        });
        await userRepository.save(user);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "default-secret-key", { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
        res.status(201).json({ token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "default-secret-key", { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
        res.json({ token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
