import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { Card, Typography, Spinner } from "@material-tailwind/react";

export default function AdminUserPointsList({ onSelectUser }) {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchPoints = async () => {
try {
const res = await api.get("/admin-user-points/all");
setData(res.data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};
fetchPoints();
}, []);

if (loading) {
return (
<div className="flex justify-center items-center h-40">
<Spinner className="h-8 w-8" />
</div>
);
}

return (
<Card className="p-4">
<Typography variant="h5" className="mb-4">
Danh sách người dùng & tổng điểm
</Typography>
<div className="overflow-x-auto">
<table className="w-full text-left table-auto">
<thead className="bg-gray-100">
<tr>
<th className="p-2">STT</th>
<th className="p-2">Họ tên</th>
<th className="p-2">Email</th>
<th className="p-2">Tổng điểm</th>
<th className="p-2">Xem</th>
</tr>
</thead>
<tbody>
{data.map((user, i) => (
<tr key={user._id} className="border-b hover:bg-gray-50">
<td className="p-2">{i + 1}</td>
<td className="p-2">{user.fullName}</td>
<td className="p-2">{user.email}</td>
<td className="p-2 text-blue-700 font-bold">{user.totalPoints}</td>
<td className="p-2">
<button
onClick={() => onSelectUser(user)}
className="text-sm text-blue-500 hover:underline"
>
Xem chi tiết
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</Card>
);
}