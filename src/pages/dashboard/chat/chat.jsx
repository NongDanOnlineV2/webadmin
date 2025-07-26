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
} from "@material-tailwind/react";

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  // 🆕 fetchUserById dùng fetch theo page để tìm user theo ownerId
const fetchUserById = async (ownerId) => {
  const token = localStorage.getItem("token");
  const limit = 10;
  let page = 1;
  let found = null;

  while (!found) {
    try {
      const res = await fetch(`${BaseUrl}/admin-users?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) break;

      const data = await res.json();
      const users = data.data || [];

      const matched = users.find((user) => user._id === ownerId);
      if (matched) {
        setUsersMap((prev) => ({ ...prev, [ownerId]: matched }));
        found = matched;
        return matched;
      }

      // Dừng lại nếu không còn trang nào nữa
      if (users.length < limit) break;
      page++;
    } catch (err) {
      console.error("Lỗi khi fetch người dùng:", err);
      break;
    }
  }

  return null;
};


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


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách phòng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">STT</th>
              <th className="p-3">Ảnh đại diện</th>
              <th className="p-3">Tên phòng</th>
              <th className="p-3">Room ID</th>
              <th className="p-3">Chủ phòng</th>
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
                <td className="p-3 text-sm text-gray-600">{room.ownerName}</td>
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
              <div>
                <strong>Tên phòng:</strong> {selectedRoom.roomName}
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
                    <li key={user.userId} className="flex items-center gap-2">
                      <Avatar
                        src={user.avatar ? `${BaseUrl}${user.avatar}` : ""}
                        size="sm"
                      />
                      <Typography variant="small" className="text-sm">
                        {user.fullName}{" "}
                        <span
                          className={
                            user.online ? "text-green-600" : "text-gray-400"
                          }
                        >
                          ({user.online ? "Online" : "Offline"})
                        </span>
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Đang tải...</p>
          )}
        </DialogBody>
        <DialogFooter>
            <Button variant="outlined" color="red" onClick={handleDeleteRoom}>
                Xoá phòng
            </Button>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
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

    </div>
  );
};

export default RoomTable;
