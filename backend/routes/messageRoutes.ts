// src/routes/messageRoutes.ts
import express from "express";
import { getMessagesByRoom } from "../controllers/messageController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:roomId", authenticateJWT, getMessagesByRoom);

export { router as messageRoutes };
