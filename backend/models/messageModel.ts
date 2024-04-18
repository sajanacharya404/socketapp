// src/models/messageModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface MessageInterface extends Document {
  text: string;
  room: string;
}

const messageSchema = new Schema<MessageInterface>(
  {
    text: { type: String, required: true },
    room: { type: String, required: true },
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

const Message = mongoose.model<MessageInterface>("Message", messageSchema);

export default Message;
