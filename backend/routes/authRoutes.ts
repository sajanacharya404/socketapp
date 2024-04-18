import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export { router as authRoutes };
