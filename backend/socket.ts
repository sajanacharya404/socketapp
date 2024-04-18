// src/socket.ts
import { Server, Socket } from "socket.io";
import Message from "./models/messageModel";

const handleSocketEvents = (socket: Socket, io: Server) => {
  socket.on("joinRoom", async (roomId: string) => {
    socket.join(roomId);
  });

  socket.on(
    "sendMessage",
    async (data: { message: string; roomId: string }) => {
      const { message, roomId } = data;
      // Save message to database
      const newMessage = new Message({ text: message, room: roomId });
      await newMessage.save();
      // Broadcast message to all clients in the room
      io.to(roomId).emit("message", message);
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

export { handleSocketEvents };
