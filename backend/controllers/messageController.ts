// src/controllers/messageController.ts
import { Request, Response } from "express";
import Message from "../models/messageModel";

const getMessagesByRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getMessagesByRoom };
