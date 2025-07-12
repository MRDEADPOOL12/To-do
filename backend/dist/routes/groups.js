"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const TaskGroup_1 = require("../entities/TaskGroup");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const groupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional()
});
router.use(auth_1.auth);
// Get all groups for the authenticated user
router.get("/", async (req, res) => {
    try {
        const groups = await database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup)
            .createQueryBuilder("group")
            .leftJoinAndSelect("group.tasks", "tasks")
            .where("group.user = :userId", { userId: req.user?.id })
            .orderBy("group.createdAt", "DESC")
            .getMany();
        res.json(groups);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Create a new group
router.post("/", async (req, res) => {
    try {
        const { name, description } = groupSchema.parse(req.body);
        const groupRepository = database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup);
        const group = groupRepository.create({
            name,
            description,
            user: req.user
        });
        await groupRepository.save(group);
        res.status(201).json(group);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
// Update a group
router.put("/:id", async (req, res) => {
    try {
        const { name, description } = groupSchema.parse(req.body);
        const groupRepository = database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup);
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});
// Delete a group
router.delete("/:id", async (req, res) => {
    try {
        const groupRepository = database_1.AppDataSource.getRepository(TaskGroup_1.TaskGroup);
        const group = await groupRepository.findOne({
            where: { id: req.params.id, user: { id: req.user?.id } }
        });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        await groupRepository.remove(group);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
