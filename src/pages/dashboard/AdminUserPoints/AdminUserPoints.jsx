import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
  Card, CardBody,
  Input, Button, Typography,
  Select, Option,
  Spinner, Dialog, DialogHeader, DialogBody
} from "@material-tailwind/react";
import Pagination from "@/components/Pagination";
import { BaseUrl } from "@/ipconfig";
export default function AdminUserPoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const defaultLimit = 10;
  const searchLimit = 100;
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [open, setOpen] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin-user-points", {
        params: {
          limit: isSearching ? searchLimit : defaultLimit,
          sort,
        },
      });

      let rawData = res.data?.data || [];

      if (isSearching && search) {
        rawData = rawData.filter(user =>
          user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
        );
      }

      rawData.sort((a, b) =>
        sort === "asc" ? a.totalPoint - b.totalPoint : b.totalPoint - a.totalPoint
      );

      setTotal(Math.ceil(rawData.length / defaultLimit));
      const paginatedData = rawData.slice((page - 1) * defaultLimit, page * defaultLimit);
      setData(paginatedData);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, isSearching]);

  const handleSearch = () => {
    setSearch(inputSearch.trim());
    setPage(1);
    setIsSearching(true);
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
            <Input label="Tìm theo Tên" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} />
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
            total={total}
            current={page}
            onChange={(value) => setPage(value)}
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
