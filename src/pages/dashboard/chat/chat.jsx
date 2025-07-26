import React, { useEffect, useState } from "react";
import { BaseUrl } from "@/ipconfig";
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
} from "@material-tailwind/react";

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomMode, setNewRoomMode] = useState("public");
  const [newRoomOwnerId, setNewRoomOwnerId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    const [roomsRes, usersRes] = await Promise.all([
      fetch(`${BaseUrl}/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${BaseUrl}/admin-users?page=1&limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const [roomsData, usersRaw] = await Promise.all([
      roomsRes.json(),
      usersRes.json(),
    ]);
    const usersData = usersRaw.data || [];
    const enrichedRooms = roomsData.map((room) => {
      const owner = usersData.find((user) => user._id === room.ownerId);
      return {
        ...room,
        ownerName: owner ? owner.fullName : "Không rõ",
      };
    });

    setRooms(enrichedRooms);
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
  }
};

const totalPages = Math.ceil(rooms.length / roomsPerPage);

const paginatedRooms = rooms.slice(
  (currentPage - 1) * roomsPerPage,
  currentPage * roomsPerPage
);

  const handleRowClick = (roomId) => {
    const room = rooms.find((r) => r.roomId === roomId);
    setSelectedRoom(room);
    setOpenDialog(true);
  };
  const handleDeleteRoom = async () => {
  if (!selectedRoom) return;

  const confirmDelete = window.confirm("Bạn có chắc muốn xoá phòng này?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl}/chat/room/${selectedRoom.roomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Xoá thất bại");

    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.roomId !== selectedRoom.roomId)
    );
    setOpenDialog(false);
  } catch (err) {
    console.error("Lỗi khi xoá phòng:", err);
    alert("Không thể xoá phòng. Vui lòng thử lại.");
  }
};
const handleAddUserToRoom = async (roomId, userId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl}/chat/room/${roomId}/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Thêm người dùng thất bại");
    alert("Đã thêm người dùng vào phòng");
    fetchData(); // cập nhật lại danh sách phòng
  } catch (err) {
    console.error("Lỗi khi thêm user:", err);
    alert("Không thể thêm người dùng.");
  }
};
const handleRemoveUserFromRoom = async (roomId, userId) => {
  // Kiểm tra nếu phòng không phải public thì không cho xoá
  const room = rooms.find((r) => r.roomId === roomId);
  if (room?.mode !== "public") {
    alert("Chỉ có thể xoá thành viên khỏi phòng công khai (public).");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl}/chat/room/${roomId}/remove-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Xoá người dùng thất bại");
    alert("Đã xoá người dùng khỏi phòng");
    fetchData();
  } catch (err) {
    console.error("Lỗi khi xoá user:", err);
    alert("Không thể xoá người dùng.");
  }
};

const handleCreateRoom = async (roomName, mode) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BaseUrl}/chat/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomName,
        mode,
      }),
    });

    if (!res.ok) throw new Error("Tạo phòng thất bại");

    alert("Đã tạo phòng mới");
    fetchData(); // cập nhật lại danh sách phòng
  } catch (err) {
    console.error("Lỗi khi tạo phòng:", err);
    alert("Không thể tạo phòng.");
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4"> 
        <h1 className="text-2xl font-semibold">Danh sách phòng</h1>
            <Button
              size="sm"
              color="blue"
              onClick={() => setOpenCreateRoomDialog(true)}
            >
              Tạo phòng
            </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">STT</th>
              <th className="p-3">Ảnh đại diện</th>
              <th className="p-3">Tên phòng</th>
              <th className="p-3">Room ID</th>
              <th className="p-3">Số thành viên</th>
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
                      src={`${BaseUrl}${room.roomAvatar}`}
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
                <td className="p-3 text-sm text-gray-600">{room.roomId}</td>
                <td className="p-3">{room.users?.length || 0}</td>
                <td className="p-3 text-sm text-gray-600">{room.ownerName}</td>
                <td className="p-3 text-center">
                  <Menu placement="bottom-end"> 
                    <MenuHandler>
                      <Button size="sm" variant="text">⋯</Button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room);
                          handleDeleteRoom();
                        }}
                      >
                        🗑 Xoá phòng
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
                <strong>Room ID:</strong> {selectedRoom.roomId}
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
                          src={user.avatar ? `${BaseUrl}${user.avatar}` : ""}
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
        <option value="private">Riêng tư</option>
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

    </div>
  );
};

export default RoomTable;
