// src/controllers/messageController.ts
import { Request, Response } from "express";
import Message from "../models/messageModel";
import { redisClient } from "../server";

const getMessagesByRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const cachedMessages = await redisClient.get(roomId);
    if (cachedMessages) {
      console.log("Retrieved messages from Redis cache");
      return res.json(JSON.parse(cachedMessages));
    }

    const messages = await Message.find({ room: roomId }).sort({
      createdAt: 1,
    });

    // Cache messages in Redis for future use
    await redisClient.set(roomId, JSON.stringify(messages));

    // Return the messages
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getMessagesByRoom };
