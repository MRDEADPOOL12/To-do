import request from "supertest";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import express from "express";
import authRoutes from "../routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Authentication", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AppDataSource.getRepository(User).clear();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "password123",
          name: "Test User"
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");

      const user = await AppDataSource.getRepository(User).findOneBy({
        email: "test@example.com"
      });
      expect(user).toBeTruthy();
      expect(user?.name).toBe("Test User");
    });

    it("should not register a user with invalid data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "123",
          name: ""
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid input");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "password123",
          name: "Test User"
        });
    });

    it("should login user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123"
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should not login with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword"
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
}); 