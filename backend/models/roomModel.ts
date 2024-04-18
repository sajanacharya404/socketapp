// src/models/roomModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface RoomInterface extends Document {
  name: string;
  participants: string[];
}

const roomSchema = new Schema<RoomInterface>({
  name: { type: String, required: true },
  participants: [{ type: String }],
});

const Room = mongoose.model<RoomInterface>("Room", roomSchema);

export default Room;
