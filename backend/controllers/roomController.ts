import { Response } from "express";
import Room from "../models/roomModel";
import { AuthenticatedRequest } from "../types";

const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    const room = new Room({ name });
    await room.save();
    res.status(201).json({ roomId: room._id });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const joinRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomName } = req.params; // Change roomId to roomName
    const { username } = req.user as { username: string };

    const room = await Room.findOne({ name: roomName }); // Find room by name
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!room.participants.includes(username)) {
      room.participants.push(username);
      await room.save();
    }

    res.json({ message: "Joined room successfully" });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createRoom, joinRoom };
