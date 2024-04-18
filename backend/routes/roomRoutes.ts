// src/routes/roomRoutes.ts
import express from "express";
import { createRoom, joinRoom } from "../controllers/roomController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, createRoom);
router.post("/:roomName/join", authenticateJWT, joinRoom);

export { router as roomRoutes };
