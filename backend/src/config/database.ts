import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { TaskGroup } from "../entities/TaskGroup";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "todo_app",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Task, TaskGroup],
  migrations: [],
  subscribers: [],
}); 