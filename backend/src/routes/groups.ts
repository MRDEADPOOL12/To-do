import { Router } from "express";
import { AppDataSource } from "../config/database";
import { TaskGroup } from "../entities/TaskGroup";
import { auth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const groupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

router.use(auth);

// Get all groups for the authenticated user
router.get("/", async (req, res) => {
  try {
    const groups = await AppDataSource.getRepository(TaskGroup)
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.tasks", "tasks")
      .where("group.user = :userId", { userId: req.user?.id })
      .orderBy("group.createdAt", "DESC")
      .getMany();

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new group
router.post("/", async (req, res) => {
  try {
    const { name, description } = groupSchema.parse(req.body);
    
    const groupRepository = AppDataSource.getRepository(TaskGroup);
    const group = groupRepository.create({
      name,
      description,
      user: req.user
    });

    await groupRepository.save(group);
    res.status(201).json(group);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Update a group
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = groupSchema.parse(req.body);
    
    const groupRepository = AppDataSource.getRepository(TaskGroup);
    const group = await groupRepository.findOne({
      where: { id: req.params.id, user: { id: req.user?.id } }
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.name = name;
    group.description = description;

    await groupRepository.save(group);
    res.json(group);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a group
router.delete("/:id", async (req, res) => {
  try {
    const groupRepository = AppDataSource.getRepository(TaskGroup);
    const group = await groupRepository.findOne({
      where: { id: req.params.id, user: { id: req.user?.id } }
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await groupRepository.remove(group);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 