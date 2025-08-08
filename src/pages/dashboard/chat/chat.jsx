import React, { useEffect, useState, useRef } from "react";
import { BaseUrl } from "@/ipconfig";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Input
} from "@material-tailwind/react";
import { connectSocket } from "../user/socket";
import ChatRoomDialog from "../user/ChatRoomDialog";

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomMode, setNewRoomMode] = useState("public"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [connected, setConnected] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [openUserListDialog, setOpenUserListDialog] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const usersPerPage = 10;
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const socketRef = useRef(null);
  const roomsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    const roomsRes = await fetch(`${BaseUrl()}/chat/rooms/public`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const roomsData = await roomsRes.json();
    const roomsWithOwnerName = await Promise.all(
      roomsData.map(async (room) => {
        const detail = await fetchRoomDetail(room.roomId);
        return {
          ...room,
          ownerName: detail?.ownerName || "Không xác định",
        };
      })
    );
    setRooms(roomsWithOwnerName);
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
  }
};

const totalPages = Math.ceil(rooms.length / roomsPerPage);

const paginatedRooms = rooms.slice(
  (currentPage - 1) * roomsPerPage,
  currentPage * roomsPerPage
);
const fetchRoomDetail = async (roomId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BaseUrl()}/chat/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Không lấy được thông tin phòng");

    const roomData = await res.json();

    // ✅ Tìm tên chủ phòng
    const owner = roomData.users?.find((u) => u.userId === roomData.ownerId);
    roomData.ownerName = owner?.fullName || "Không xác định";

    return roomData;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết phòng:", err);
    alert("Không thể tải thông tin phòng.");
    return null;
  }
};

const handleRowClick = async (roomId) => {
  const roomDetail = await fetchRoomDetail(roomId);
  if (roomDetail) {
    setSelectedRoom(roomDetail);
    setOpenDialog(true);
  }
};

  const handleDeleteRoom = async (room) => {
  const confirmDelete = window.confirm("Bạn có chắc muốn xoá phòng này?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");


    const res = await fetch(`${BaseUrl()}/chat/room/${room.roomId}`, {

    
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("res: ",res);
    if (!res.ok) throw new Error("Xoá thất bại");

    setRooms((prevRooms) =>
      prevRooms.filter((r) => r.roomId !== room.roomId)
    );
    setOpenDialog(false);
  } catch (err) {
    console.error("Lỗi khi xoá phòng:", err);
    alert("Không thể xoá phòng. Vui lòng thử lại.");
  }
};
const refreshRoomDetail = async (roomId) => {
  const updatedDetail = await fetchRoomDetail(roomId);
  if (updatedDetail) setSelectedRoom(updatedDetail);
};

const handleAddUserToRoom = async (roomId, userId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl()}/chat/room/${roomId}/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Thêm người dùng thất bại");
    alert("Đã thêm người dùng vào phòng");
    await refreshRoomDetail(roomId);
    fetchData(); // cập nhật lại danh sách phòng
  } catch (err) {
    console.error("Lỗi khi thêm user:", err);
    alert("Không thể thêm người dùng.");
  }
};
const handleRemoveUserFromRoom = async (roomId, userId) => {
  // Kiểm tra nếu phòng không phải public thì không cho xoá
  const confirmRemove = window.confirm("Bạn có chắc muốn xoá người dùng này khỏi phòng?");
  if (!confirmRemove) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl()}/chat/room/${roomId}/remove-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Xoá người dùng thất bại");
    alert("Đã xoá người dùng khỏi phòng");
    await refreshRoomDetail(roomId);
    fetchData();
  } catch (err) {
    console.error("Lỗi khi xoá user:", err);
    alert("Không thể xoá người dùng.");
  }
};
const handleCreateRoom = async (roomName, mode) => {
  try {
    const token = localStorage.getItem("token");

    const decoded = jwtDecode(token);
    const ownerId = decoded?.user?.id || decoded?.id;

    const res = await fetch(`${BaseUrl()}/chat/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomName,
        mode,
        ownerId,
      }),
    });

    if (!res.ok) throw new Error("Tạo phòng thất bại");
    const resData = await res.json();
    const newRoomId = resData.room?.roomId;
    await fetch(`${BaseUrl()}/chat/room/${newRoomId}/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: ownerId }),
    });

    alert("Đã tạo phòng mới");

    fetchData(); // cập nhật lại danh sách phòng
  } catch (err) {
    console.error("Lỗi khi tạo phòng:", err);
    alert("Không thể tạo phòng.");
  }
};
// socket
const handleStartPrivateChat = (targetUserId, targetFullName) => {
  let socket = socketRef.current;

  // Nếu socket chưa có hoặc đã disconnect → kết nối
  if (!socket || socket.disconnected) {
    socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setConnected(true);
      socket.emit("bulkJoinRooms");
      socket.emit("startPrivateChat", { targetUserId, targetFullName });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setConnected(false);
    });

    socket.on("noti", ({ type, data }) => {
      console.log("[NOTI]", type, data);
      if (type === "roomReady") {
        setChatRoomId(data.roomId);
        setChatOpen(true);
      }
    });

    return;
  }

  
  if (socket.connected) {
    socket.emit("startPrivateChat", { targetUserId, targetFullName });
    console.log("📤 Gửi yêu cầu tạo phòng với:", targetUserId);
  } else {
    alert("⚠️ Socket chưa sẵn sàng!");
  }
};

const fetchUserList = async (page = 1, keyword = "") => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${BaseUrl()}/admin-users?page=${page}&limit=${usersPerPage}&fullName=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setUserList(data?.data || []);
    setUserTotalPages(Math.ceil((data?.total || 0) / usersPerPage));
    setUserCurrentPage(page);
    setOpenUserListDialog(true);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
  }
};
const handleSearch = () => {
  const keyword = searchText.trim();
  if (!keyword) return;
  console.log("🔍 Thực hiện tìm kiếm với:", keyword);

  setIsSearching(true);
  setUserCurrentPage(1);
  fetchUserList(1, keyword); 
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4"> 
        <h1 className="text-2xl font-semibold">Danh sách phòng</h1>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outlined"
                onClick={() => setOpenCreateRoomDialog(true)}
                color="blue"
              >
                Tạo phòng
              </Button>
              <Button
                color="blue"
                onClick={fetchUserList}
                className="bg-blue-500"
              >
                Chat riêng
              </Button>
            </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">STT</th>
              <th className="p-3">Ảnh đại diện</th>
              <th className="p-3">Tên phòng</th>
              <th className="p-3">Chủ phòng</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRooms.map((room, index) => (
              <tr
                key={room.roomId}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(room.roomId)}
              >
                <td className="p-3">{(currentPage - 1) * roomsPerPage + index + 1}</td>
                <td className="p-3">
                  {room.roomAvatar ? (
                    <img
                      src={`${BaseUrl()}${room.roomAvatar}`}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      N/A
                    </div>
                  )}
                </td>
                <td className="p-3">{room.roomName}</td>
                <td className="p-3 text-sm text-gray-600">{room.ownerName}</td>
                <td className="p-3 text-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room);
                        }}
                      >
                        Xoá phòng
                      </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            Không có phòng nào.
          </div>
        )}
      </div>

      {/* Dialog chi tiết phòng */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="md">
        <DialogHeader>Chi tiết phòng</DialogHeader>
        <DialogBody>
          {selectedRoom ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Tên phòng:</strong> {selectedRoom.roomName}
                </div>
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => setOpenAddUserDialog(true)}
                >
                  Thêm thành viên
                </Button>
              </div>
              <div>
                <strong>Chế độ:</strong> {selectedRoom.mode}
              </div>
              <div>
                <strong>Thành viên:</strong>
                <ul className="mt-2 space-y-2">
                  {selectedRoom.users?.map((user) => (
                    <li key={user.userId} className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={user.avatar ? `${BaseUrl()}${user.avatar}` : ""}
                          size="sm"
                        />
                        <Typography variant="small" className="text-sm flex items-center gap-1">
                          {user.fullName}{" "}
                          <span className={user.online ? "text-green-600" : "text-gray-400"}>
                            ({user.online ? "Online" : "Offline"})
                          </span>
                          {user.userId === selectedRoom.ownerId && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 text-[12px] font-medium px-2 py-0.5 border border-yellow-300 shadow-sm">
                              👑 Chủ phòng
                            </span>
                          )}
                        </Typography>
                      </div>
                      {user.userId !== selectedRoom.ownerId && (
                        <Button
                          size="sm"
                          variant="text"
                          color="red"
                          onClick={() => handleRemoveUserFromRoom(selectedRoom.roomId, user.userId)}
                        >
                          Xoá
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <Dialog open={openAddUserDialog} handler={() => setOpenAddUserDialog(false)} size="sm">
                  <DialogHeader>Thêm thành viên</DialogHeader>
                  <DialogBody>
                    <input
                      type="text"
                      placeholder="Nhập userId"
                      className="border px-2 py-1 rounded w-full"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                    />
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        handleAddUserToRoom(selectedRoom.roomId, newUserId);
                        setNewUserId("");
                        setOpenAddUserDialog(false);
                      }}
                      size="sm"
                      color="blue"
                    >
                      Thêm
                    </Button>
                    <Button variant="text" onClick={() => setOpenAddUserDialog(false)}>
                      Đóng
                    </Button>
                  </DialogFooter>
                </Dialog>
              </div>
            </div>
          ) : (
            <p>Đang tải...</p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Dialog tạo phòng */}
      <Dialog open={openCreateRoomDialog} handler={() => setOpenCreateRoomDialog(false)} size="sm">
        <DialogHeader>Tạo phòng mới</DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên phòng</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Nhập tên phòng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chế độ</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={newRoomMode}
              onChange={(e) => setNewRoomMode(e.target.value)}
            >
              <option value="public">Công khai</option>
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!newRoomName || !newRoomMode) {
                alert("Vui lòng nhập đầy đủ thông tin");
                return;
              }
              handleCreateRoom(newRoomName, newRoomMode);
              setOpenCreateRoomDialog(false);
              setNewRoomName("");
              setNewRoomMode("public");
            }}
            color="blue"
            size="sm"
          >
            Tạo
          </Button>
          <Button variant="text" onClick={() => setOpenCreateRoomDialog(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>
      {/* Dialog chat riêng */}
      <Dialog
        open={openUserListDialog}
        handler={() => setOpenUserListDialog(false)}
        size="lg"
      >
        <DialogHeader>Chọn người dùng để chat riêng</DialogHeader>
        <DialogBody className="max-h-[500px] overflow-y-auto px-1">
          <div className="flex items-center gap-2 mb-4">
            <Input
              label="Tìm kiếm theo tên hoặc email"
              value={searchText}
              onChange={(e) => {
                const val = e.target.value;
                setSearchText(val);

                if (val.trim() === "") {
                  setIsSearching(false);
                  setUserCurrentPage(1);
                  fetchUserList(1, "");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="flex-1"
            />
            <Button className="bg-black text-white whitespace-nowrap" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-2">Avatar</th>
                <th className="p-2">Tên</th>
                <th className="p-2">Email</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user._id} className="border-b text-sm hover:bg-gray-50">
                  <td className="p-2">
                    <Avatar
                      src={user.avatar ? `${BaseUrl()}${user.avatar}` : ""}
                      size="sm"
                    />
                  </td>
                  <td className="p-2">{user.fullName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {user.isActive
                      ? <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">Active</span>
                      : <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Inactive</span>}
                  </td>
                  <td className="p-2 text-center">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleStartPrivateChat(user._id, user.fullName);
                        setOpenUserListDialog(false);
                      }}
                    >
                      Nhắn tin
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
            <Button
              size="sm"
              variant="outlined"
              disabled={userCurrentPage === 1}
              onClick={() => fetchUserList(1, isSearching ? searchText : "")}
            >
              «
            </Button>

            <Button
              size="sm"
              variant="outlined"
              disabled={userCurrentPage === 1}
              onClick={() => fetchUserList(userCurrentPage - 1, isSearching ? searchText : "")}
            >
              ‹
            </Button>

            {Array.from({ length: userTotalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === userTotalPages ||
                  Math.abs(page - userCurrentPage) <= 2
                );
              })
              .reduce((acc, page, i, arr) => {
                if (i > 0 && page - arr[i - 1] > 1) {
                  acc.push("ellipsis");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, index) =>
                item === "ellipsis" ? (
                  <span key={index} className="px-2 text-gray-500">...</span>
                ) : (
                  <Button
                    key={index}
                    size="sm"
                    variant={userCurrentPage === item ? "filled" : "outlined"}
                    className={`min-w-[32px] ${userCurrentPage === item ? "bg-black text-white" : ""}`}
                    onClick={() => fetchUserList(item, isSearching ? searchText : "")}
                  >
                    {item}
                  </Button>
                )
              )}

            <Button
              size="sm"
              variant="outlined"
              disabled={userCurrentPage === userTotalPages}
              onClick={() => fetchUserList(userCurrentPage + 1, isSearching ? searchText : "")}
            >
              ›
            </Button>

            <Button
              size="sm"
              variant="outlined"
              disabled={userCurrentPage === userTotalPages}
              onClick={() => fetchUserList(userTotalPages, isSearching ? searchText : "")}
            >
              »
            </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenUserListDialog(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>


      <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
        {/* First page */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          «
        </Button>

        {/* Prev */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </Button>

        {/* Dynamic page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 2
            );
          })
          .reduce((acc, page, i, arr) => {
            if (i > 0 && page - arr[i - 1] > 1) {
              acc.push("ellipsis");
            }
            acc.push(page);
            return acc;
          }, [])
          .map((item, index) =>
            item === "ellipsis" ? (
              <span key={index} className="px-2 text-gray-500">...</span>
            ) : (
              <Button
                key={index}
                size="sm"
                variant={currentPage === item ? "filled" : "outlined"}
                className={`min-w-[32px] ${currentPage === item ? "bg-black text-white" : ""}`}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </Button>
            )
          )}

        {/* Next */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </Button>

        {/* Last page */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          »
        </Button>
      </div>

{chatOpen && chatRoomId && (
  <ChatRoomDialog
    open={chatOpen}
    onClose={() => setChatOpen(false)}
    roomId={chatRoomId}
  />
)}
    </div>
  );
};

export default RoomTable;
