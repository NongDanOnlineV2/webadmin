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
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const decoded = token ? jwtDecode(token) : null;
const currentUserId = decoded?.id;


export default function ChatRoomDialog({ open, onClose, initialRoomId = null }) {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadMarkerIndex, setUnreadMarkerIndex] = useState(null);

  useEffect(() => {
    if (!open) return;

    fetch(`${BaseUrl()}/chat/rooms/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data || []);
          const defaultRoom = data.find((r) => r._id === initialRoomId);
          setCurrentRoom(defaultRoom || data[0] || null);
        } else {
          console.error("Dữ liệu trả về không phải mảng:", data);
          setRooms([]);
        }
        
      });
  }, [open]);


  useEffect(() => {
    if (!currentRoom || !open) return;

    setMessages([]);

    const savedMessages = getMessagesFromLocal(currentRoom.roomId || currentRoom._id);
    setMessages(savedMessages);

    const socket = getSocket();

    const onMessage = ({ roomId, ...msg }) => {
      if (roomId === currentRoom.roomId || roomId === currentRoom._id) {
        setMessages((prev) => {
          const updated = [...prev, msg];
          saveMessagesToLocal(roomId, updated);
          return updated;
        });
      }
    };


    const onNoti = ({ type, data }) => {
      if (type === "chatMessage") {
        const isNewUnread = data.fromUnreadFetch;
        const msgRoomId = data.roomId;
        const currentId = currentRoom?.roomId || currentRoom?._id;
        if (msgRoomId !== currentId) return
        setMessages((prev) => {
          const updated = [...prev, data];

          if (isNewUnread && unreadMarkerIndex === null) {
            setUnreadMarkerIndex(prev.length); 
            setTimeout(() => setUnreadMarkerIndex(null), 5000);
          }

          saveMessagesToLocal(msgRoomId, updated);
          return updated;
        });
      }
    };


    const onUserStatusUpdate = ({ roomId, userId, online }) => {
      console.log("Cập nhật trạng thái:",roomId, userId, online);

      setRooms((prevRooms) => {
        prevRooms.map((room) => {
          if (room.roomId !== roomId && room._id !== roomId) return room;

          const updatedUsers = room.users.map((u) =>
          u.userId === userId ? { ...u, online } : u
        );
        return { ...room, users: updatedUsers };
        })
    })

    // Nếu user online lại và đang trong phòng hiện tại, thì tải lại tin nhắn chưa đọc
    const isRecipient = currentRoom?.users?.some((u) => u.userId === userId);
    if (online && isRecipient && roomId === currentRoom?.roomId) {
      if (lastReadMessageId) {
        loadMessagesSinceLastRead(roomId, lastReadMessageId);
      }
    }

  };

  socket.on("noti", onNoti);
  socket.on("userStatusUpdate", onUserStatusUpdate);

    return () => {
      socket.off("noti", onNoti);
      socket.off("userStatusUpdate", onUserStatusUpdate);
    };
  }, [currentRoom, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !currentRoom) return;
    getSocket().emit("chatMessage", {
      roomId: currentRoom.roomId ,
      message: input,
    });
    setInput("");
  };

  const getMessagesFromLocal = (roomId) => {
    const key = `chat_messages_${roomId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
};

  const saveMessagesToLocal = (roomId, messages) => {
    const key = `chat_messages_${roomId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  };

const loadMessagesSinceLastRead = (roomId, lastReadMessageId) => {
  const socket = getSocket();

  socket.emit("loadMessagesSince", { roomId, lastId: lastReadMessageId });
};


  return (
    <Dialog open={open} handler={onClose} size="xl">
      <DialogHeader className="bg-gray-300">💬 Tin nhắn</DialogHeader>

      <DialogBody className="flex h-[500px] p-0">
        {/* Sidebar - danh sách phòng */}
        <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
          {rooms.length === 0 && (
            <Typography className="text-center mt-4 text-gray-500">
              Bạn chưa có phòng nào
            </Typography>
          )}
          {rooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => setCurrentRoom(room)}
              className={`p-4 border-b cursor-pointer hover:bg-blue-100 ${
                currentRoom?.roomId === room.roomId ? "bg-blue-200" : ""
              }`}
            >
              <Typography variant="small" className="font-bold truncate">
                {room.users.map((u) =>{
                  const online = u.online ? "🟢" : "🔴";
                  return  `${u.fullName} ${online}`;
                }).join(", ")}
              </Typography>
            </div>
          ))}
        </div>

        
        {/* Khung chat */}
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Tên người đang nhắn */}
          {currentRoom && (
            <div className="sticky top-0 bg-blue-500 text-white px-6 py-2 shadow z-10 text-right">
              <Typography variant="h6" className="text-sm text-right">
                {currentRoom.users.map((u) => u.fullName).join(", ")}
              </Typography>
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-4">
            {currentRoom ? (
              messages.map((msg, index) => {
                const isMe = msg.userId === currentUserId;
                return (
                  <React.Fragment key={index}>
                    {index === unreadMarkerIndex && (
                      <div className="text-center my-2">
                        <Typography className="text-blue-500 text-sm font-semibold">
                          Tin nhắn chưa đọc
                        </Typography>
                      </div>
                    )}
                    <div className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] p-2 rounded-lg ${
                          isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <Typography variant="small" className="font-bold mb-1">
                          {msg.fullName}
                        </Typography>
                        <Typography className="text-sm">{msg.message}</Typography>
                        <Typography className="text-xs text-whit-500 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                        {msg.imageUrl && (
                          <img
                            src={
                              msg.imageUrl.startsWith("http")
                                ? msg.imageUrl
                                : `${BaseUrl()}${msg.imageUrl}`
                            }
                            alt="sent"
                            className="mt-1 max-w-[150px] rounded"
                          />
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <Typography className="text-center text-gray-400 mt-10">
                Chọn phòng để bắt đầu trò chuyện
              </Typography>
            )}
            <div ref={messagesEndRef}></div>
          </div>
          {currentRoom && (
            <div className="flex gap-2 mt-4">
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
            </div>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
}
