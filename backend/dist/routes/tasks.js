"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const Task_1 = require("../entities/Task");
const TaskGroup_1 = require("../entities/TaskGroup");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    deadline: zod_1.z.string().datetime().optional(),
    groupId: zod_1.z.string().uuid().optional()
});
router.use(auth_1.auth);
// Get all tasks for the authenticated user
router.get("/", async (req, res) => {
    try {
        const tasks = await database_1.AppDataSource.getRepository(Task_1.Task)
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.group", "group")
            .where("task.user = :userId", { userId: req.user?.id })
            .orderBy("task.createdAt", "DESC")
            .getMany();
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Create a new task
router.post("/", async (req, res) => {
    try {
        const { title, description, deadline, groupId } = taskSchema.parse(req.body);
        const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
        const task = taskRepository.create({
            title,
            description,
            deadline: deadline ? new Date(deadline) : undefined,
            user: req.user
        });
        if (groupId) {
            const group = await database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup).findOneBy({ id: groupId });
            if (!group || group.user.id !== req.user?.id) {
                return res.status(404).json({ message: "Group not found" });
            }
            task.group = group;
        }
        await taskRepository.save(task);
        res.status(201).json(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
// Update a task
router.put("/:id", async (req, res) => {
    try {
        const { title, description, deadline, groupId } = taskSchema.parse(req.body);
        const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
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
            const group = await database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup).findOneBy({ id: groupId });
            if (!group || group.user.id !== req.user?.id) {
                return res.status(404).json({ message: "Group not found" });
            }
            task.group = group;
        }
        else {
            task.group = null;
        }
        await taskRepository.save(task);
        res.json(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
        const task = await taskRepository.findOne({
            where: { id: req.params.id, user: { id: req.user?.id } }
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await taskRepository.remove(task);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Toggle task completion
router.patch("/:id/toggle", async (req, res) => {
    try {
        const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
        const task = await taskRepository.findOne({
            where: { id: req.params.id, user: { id: req.user?.id } }
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.completed = !task.completed;
        await taskRepository.save(task);
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
