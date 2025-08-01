import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { Card, Typography, Spinner, Button } from "@material-tailwind/react";

export default function AdminUserPointDetails({ user, onBack }) {
const [history, setHistory] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchHistory = async () => {
try {
const res = await api.get(`/admin-user-points?userId=${user._id}`);
setHistory(res.data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};
fetchHistory();
}, [user]);

return (
<Card className="p-4">
<div className="flex items-center justify-between mb-4">
<Typography variant="h5">Lịch sử tích điểm: {user.fullName}</Typography>
<Button size="sm" variant="outlined" onClick={onBack}>
← Quay lại
</Button>
</div>
{loading ? (
<div className="flex justify-center items-center h-40">
<Spinner className="h-8 w-8" />
</div>
) : (
<div className="overflow-x-auto">
<table className="w-full text-left table-auto">
<thead className="bg-gray-100">
<tr>
<th className="p-2">STT</th>
<th className="p-2">Điểm</th>
<th className="p-2">Lý do</th>
<th className="p-2">Thời gian</th>
</tr>
</thead>
<tbody>
{history.map((item, i) => (
<tr key={item._id} className="border-b hover:bg-gray-50">
<td className="p-2">{i + 1}</td>
<td className="p-2 text-green-600 font-semibold">+{item.points}</td>
<td className="p-2">{item.reason}</td>
<td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
{history.length === 0 && (
<Typography className="text-center text-gray-500 mt-4">Không có dữ liệu.</Typography>
)}
</div>
)}
</Card>
);
}