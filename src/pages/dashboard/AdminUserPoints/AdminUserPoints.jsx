import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
Card, CardBody, Typography,
Select, Option, Input, Spinner,
} from "@material-tailwind/react";
import Pagination from "@/components/Pagination";
import { useNavigate } from "react-router-dom";

export default function AdminUserPoints() {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

const [page, setPage] = useState(1);
const limit = 10;
const [totalPages, setTotalPages] = useState(1);

const [sort, setSort] = useState("desc");
const [minPoint, setMinPoint] = useState("");
const [maxPoint, setMaxPoint] = useState("");
const [search, setSearch] = useState(""); 
const navigate = useNavigate();

const fetchData = async () => {
setLoading(true);
try {
const res = await api.get("/admin-user-points/all", {
params: {
page,
limit,
sort,
},
});
setData(res.data?.data || []);
setTotalPages(res.data?.pagination?.totalPages || 1);
} catch (err) {
console.error("Lỗi khi tải danh sách điểm người dùng:", err);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchData();
}, [page, sort]);

const filteredData = data.filter(user => {
const point = user.totalPoint || 0;
return (
(!minPoint || point >= +minPoint) &&
(!maxPoint || point <= +maxPoint)
);
});

return (
<Card className="m-4">
<CardBody>
<Typography variant="h5" className="mb-4">Quản lý điểm người dùng</Typography>

    <div className="flex flex-wrap gap-4 mb-4 items-end">
      <Input
        label="Tìm theo họ tên"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="min-w-[200px]"
      />
      <Input
        label="Điểm tối thiểu"
        type="number"
        value={minPoint}
        onChange={(e) => setMinPoint(e.target.value)}
        className="min-w-[150px]"
      />
      <Input
        label="Điểm tối đa"
        type="number"
        value={maxPoint}
        onChange={(e) => setMaxPoint(e.target.value)}
        className="min-w-[150px]"
      />
      <Select
        label="Sắp xếp theo điểm"
        value={sort}
        onChange={(val) => setSort(val)}
        className="min-w-[150px]"
      >
        <Option value="desc">Giảm dần</Option>
        <Option value="asc">Tăng dần</Option>
      </Select>
    </div>

    {loading ? (
      <Spinner className="mx-auto" />
    ) : (
      <div className="overflow-auto">
        <table className="table-auto w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Họ tên</th>
              <th className="p-2">Email</th>
              <th className="p-2">Tổng điểm</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr
                key={user.userId}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => navigate(`/dashboard/AdminUserPointDetails?userId=${user.userId}`)}
              >
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.totalPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <div className="mt-4">
      <Pagination total={totalPages} current={page} onChange={setPage} />
    </div>
  </CardBody>
</Card>

);
}