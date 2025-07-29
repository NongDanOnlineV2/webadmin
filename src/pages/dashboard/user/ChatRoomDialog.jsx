import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { BaseUrl } from "@/ipconfig";
import { getSocket } from "./socket"; 

const token = localStorage.getItem("token");

export default function ChatRoomDialog({ roomId, open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !open) return;

    // Lấy thông tin phòng + reset tin nhắn
    fetch(`${BaseUrl}/chat/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((room) => {
        setRoomInfo(room);
        setMessages([]); // hoặc fetch thêm tin nhắn cũ nếu API có
      });

    // Nhận tin nhắn mới
    const onMessage = ({ roomId: incomingRoomId, ...msg }) => {
      if (incomingRoomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    getSocket().on("noti", ({ type, data }) => {
      if (type === "chatMessage") onMessage(data);
    });

    return () => {
      getSocket().off("noti", onMessage);
    };
  }, [roomId, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    getSocket().emit("chatMessage", { roomId, message: input });
    setInput("");
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>
        💬 Chat với{" "}
        {roomInfo?.users?.map((u) => u.fullName).join(", ") || "người dùng"}
      </DialogHeader>

      <DialogBody className="overflow-y-auto max-h-[400px] px-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <Typography variant="small" className="font-bold">
              {msg.fullName}
            </Typography>
            <Typography className="text-sm text-gray-700">
              {msg.message}
            </Typography>
            {msg.imageUrl && (
              <img
                src={
                  msg.imageUrl.startsWith("http")
                    ? msg.imageUrl
                    : `${BaseUrl}${msg.imageUrl}`
                }
                alt="sent"
                className="mt-1 max-w-[150px] rounded"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </DialogBody>

      <DialogFooter className="gap-2">
        <Input
          label="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1"
        />
        <Button color="blue" onClick={handleSend}>
          Gửi
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
