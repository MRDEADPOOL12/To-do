import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import groupRoutes from "./routes/groups";
import userRoutes from "./routes/users";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);

// Database connection and server start
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }); 