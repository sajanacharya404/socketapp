import React, { useState, useEffect } from "react";
import axios from "axios";

interface ChatRoomProps {
  accessToken: string;
  onLogout: () => void;
  socket: SocketIOClient.Socket;
  roomId: string; // Add roomId prop
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  accessToken,
  onLogout,
  socket,
  roomId,
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", roomId); // Join the specified room
    loadMessageHistory();
  }, [roomId]); // Reload message history when roomId changes

  useEffect(() => {
    socket.on("message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  const loadMessageHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/messages/${roomId}`, // Use roomId in the API URL
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessages(response.data.map((msg: any) => msg.text));
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  const handleSendMessage = () => {
    socket.emit("sendMessage", { message, roomId }); // Send message to the current room
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ChatRoom;
