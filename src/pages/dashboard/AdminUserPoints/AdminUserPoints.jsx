import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
  Card, CardBody,
  Input, Button, Typography,
  Select, Option,
  Spinner, Dialog, DialogHeader, DialogBody
} from "@material-tailwind/react";
import Pagination from "@/components/Pagination";

export default function AdminUserPoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("desc");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedHistory, setSelectedHistory] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = async (customPage = page, customSearch = search) => {
    setLoading(true);
    try {
      const res = await api.get("/admin-user-points", {
        params: {
          page: customPage,
          limit,
          sort,
        },
      });

      let rawData = res.data?.data || [];
      const pagination = res.data?.pagination || {};

      // Tìm kiếm client-side (nếu backend không hỗ trợ)
      if (customSearch) {
        rawData = rawData.filter(user =>
          user.fullName?.toLowerCase().includes(customSearch.toLowerCase()) ||
          user.email?.toLowerCase().includes(customSearch.toLowerCase())
        );
      }

      setData(rawData);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, search);
  }, [page, sort, search]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      setSearch("");
      setPage(1);
    }
  };

  const formatAction = (action) => {
    switch (action) {
      case "comment_video":
        return { label: "💬 Bình luận video", color: "bg-blue-100 text-blue-800" };
      case "like_video":
        return { label: "👍 Thích video", color: "bg-green-100 text-green-800" };
      case "create_post":
        return { label: "📝 Tạo post", color: "bg-yellow-100 text-yellow-800" };
      case "like_post":
        return { label: "❤️ Thích post", color: "bg-pink-100 text-pink-800" };
      case "create_video":
        return { label: "📽 Tạo video", color: "bg-purple-100 text-purple-800" };
      case "comment_post":
        return { label: "💬 Bình luận post", color: "bg-orange-100 text-orange-800" };
      default:
        return { label: "❓ Hành động khác", color: "bg-gray-100 text-gray-800" };
    }
  };

  const toggleDialog = (history) => {
    setSelectedHistory(history);
    setOpen(!open);
  };

  return (
    <Card className="m-4">
      <CardBody>
        <Typography variant="h5" className="mb-4">Quản lý điểm người dùng</Typography>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <Input
              label="Tìm theo Tên"
              value={searchInput}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full md:w-1/3">
            <Select label="Sắp xếp theo điểm" value={sort} onChange={val => setSort(val)}>
              <Option value="desc">Giảm dần</Option>
              <Option value="asc">Tăng dần</Option>
            </Select>
          </div>

          <div className="w-full md:w-1/6">
            <Button fullWidth onClick={handleSearch} className="bg-black text-white">
              TÌM KIẾM
            </Button>
          </div>
        </div>

        {loading ? <Spinner className="mx-auto" /> : (
          <div className="overflow-auto">
            <table className="w-full table-auto text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Họ tên</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Tổng điểm</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map(user => (
                  <tr key={user.userId} className="border-b">
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.totalPoint}</td>
                    <td className="p-2">
                      <Button size="sm" onClick={() => toggleDialog(user.history)}>Xem lịch sử</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <Pagination
            current={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>

        <Dialog open={open} handler={toggleDialog} size="lg">
          <DialogHeader>Lịch sử tích điểm</DialogHeader>
          <DialogBody className="max-h-[500px] overflow-y-auto">
            {selectedHistory?.length > 0 ? (
              <ul className="space-y-2">
                {selectedHistory.map((item, idx) => {
                  const actionInfo = formatAction(item.action);
                  return (
                    <li
                      key={idx}
                      className={`rounded-md px-4 py-2 text-sm ${actionInfo.color}`}
                    >
                      +{item.point} điểm - {actionInfo.label} -{" "}
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </li>
                  );
                })}
              </ul>
            ) : <p>Không có dữ liệu</p>}
          </DialogBody>
        </Dialog>
      </CardBody>
    </Card>
  );
}
