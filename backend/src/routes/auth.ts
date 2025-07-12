import { Router } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      name
    });

    await userRepository.save(user);
    
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    const signOptions: SignOptions = {
      expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"]
    };

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "default-secret-key",
      signOptions
    );

    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    const signOptions: SignOptions = {
      expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"]
    };

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "default-secret-key",
      signOptions
    );

    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 