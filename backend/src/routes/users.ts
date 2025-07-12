import { Router } from "express";
import { auth } from "../middleware/auth";
import { User } from "../entities/User";

const router = Router();

router.use(auth);

// Get current user
router.get("/me", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Since we're using the auth middleware, req.user is already populated
    // We just need to return it without the password
    const user = req.user as User;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 