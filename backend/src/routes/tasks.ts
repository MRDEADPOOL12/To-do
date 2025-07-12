import { Router } from "express";
import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";
import { TaskGroup } from "../entities/TaskGroup";
import { auth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  groupId: z.string().uuid().optional()
});

router.use(auth);

// Get all tasks for the authenticated user
router.get("/", async (req, res) => {
  try {
    const tasks = await AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.group", "group")
      .where("task.user = :userId", { userId: req.user?.id })
      .orderBy("task.createdAt", "DESC")
      .getMany();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline, groupId } = taskSchema.parse(req.body);
    
    const taskRepository = AppDataSource.getRepository(Task);
    const task = taskRepository.create({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      user: req.user
    });

    if (groupId) {
      const group = await AppDataSource.getRepository(TaskGroup)
        .createQueryBuilder("group")
        .where("group.id = :id", { id: groupId })
        .andWhere("group.user = :userId", { userId: req.user?.id })
        .getOne();

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      task.group = group;
    }

    const savedTask = await taskRepository.save(task);
    
    // Fetch the complete task with group relationship
    const taskWithGroup = await taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ["group"]
    });

    res.status(201).json(taskWithGroup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, deadline, groupId } = taskSchema.parse(req.body);
    
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id, user: { id: req.user?.id } },
      relations: ["group"]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title;
    task.description = description;
    task.deadline = deadline ? new Date(deadline) : undefined;

    if (groupId) {
      const group = await AppDataSource.getRepository(TaskGroup)
        .createQueryBuilder("group")
        .where("group.id = :id", { id: groupId })
        .andWhere("group.user = :userId", { userId: req.user?.id })
        .getOne();

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      task.group = group;
    } else {
      task.group = undefined;
    }

    const savedTask = await taskRepository.save(task);
    
    // Fetch the complete task with group relationship
    const taskWithGroup = await taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ["group"]
    });

    res.json(taskWithGroup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id, user: { id: req.user?.id } }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRepository.remove(task);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle task completion
router.patch("/:id/toggle", async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id, user: { id: req.user?.id } },
      relations: ["group"]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await taskRepository.save(task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 