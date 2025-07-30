import React, { useEffect, useState } from "react";
import {
Card, CardHeader, CardBody, Typography, Spinner,
} from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";

const AdminUserPointDetails = () => {
const location = useLocation();
const navigate = useNavigate();
const userId = new URLSearchParams(location.search).get("userId");

const [pointHistory, setPointHistory] = useState([]);
const [userInfo, setUserInfo] = useState(null);
const [loading, setLoading] = useState(true);

const pageSize = 10;
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
const fetchData = async () => {
try {
const res = await api.get(`/admin-user-points?userId=${userId}`);

const { user, points } = res.data;
setUserInfo(user);
setPointHistory(points || []);
} catch (error) {
console.error("Fetch error:", error);
} finally {
setLoading(false);
}
};
if (userId) fetchData();
}, [userId]);

const paginatedData = pointHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);
const totalPages = Math.ceil(pointHistory.length / pageSize);

if (loading) {
return (
<div className="flex justify-center items-center h-96">
<Spinner className="h-12 w-12" />
</div>
);
}

if (!userInfo) {
return (
<div className="p-4 text-center">
<Typography variant="h6">Không tìm thấy người dùng.</Typography>
</div>
);
}

return (
<Card className="h-full w-full">
<CardHeader floated={false} shadow={false} className="rounded-none px-4">
<div className="flex justify-between items-center">
<div>
<Typography variant="h5">Lịch sử điểm</Typography>
<Typography variant="small" color="gray" className="mt-1">
{userInfo.fullName} ({userInfo.email})
</Typography>
</div>
<button
onClick={() => navigate(-1)}
className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
>
← Quay lại
</button>
</div>
</CardHeader>
<CardBody className="overflow-x-auto px-4">
<table className="table-auto w-full text-left">
<thead>
<tr className="bg-gray-100">
<th className="p-2">Hành động</th>
<th className="p-2 text-right">Điểm</th>
<th className="p-2 text-right">Thời gian</th>
</tr>
</thead>
<tbody>
{paginatedData.map((item, index) => (
<tr key={index} className="hover:bg-blue-50">
<td className="p-2">{item.reason}</td>
<td className="p-2 text-right font-bold text-green-600">+{item.point}</td>
<td className="p-2 text-right text-gray-600">
{new Date(item.createdAt).toLocaleString()}
</td>
</tr>
))}
</tbody>
</table>
{/* Pagination */}
<div className="flex justify-end mt-4 gap-2">
{Array.from({ length: totalPages }).map((_, i) => {
  return (
    <button
      key={i}
      className={`px-3 py-1 border rounded ${
        currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
      }`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  );
})}

</div>
</CardBody>
</Card>
);
};

export default AdminUserPointDetails;