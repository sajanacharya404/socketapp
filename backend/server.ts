import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { handleSocketEvents } from "./socket";
import cors from "cors";
import Redis from "ioredis";

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/chatApp"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

const redisClient = new Redis();

// Listen for the 'connect' event on the Redis client
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");
  handleSocketEvents(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
