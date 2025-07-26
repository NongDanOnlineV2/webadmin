import React, { useState } from "react";
import {
Dialog,
DialogHeader,
DialogBody,
DialogFooter,
Button,
Select,
Option,
Input,
} from "@material-tailwind/react";
import axios from "axios";
import { BaseUrl } from "@/ipconfig"; // nếu bạn dùng file ipconfig

const actions = [
{ value: "DEACTIVATE_USER", label: "Khóa tài khoản" },
];

export default function ModalApproveReport({ open, onClose, reportId, token, onSuccess }) {
const [action, setAction] = useState("");
const [note, setNote] = useState("");
const [loading, setLoading] = useState(false);

const handleApprove = async () => {
if (!action || !note) {
alert("Vui lòng chọn hành động và nhập ghi chú");
return;
}
try {
  setLoading(true);
  await axios.post(
    `${BaseUrl}/admin-reports/${reportId}/approve`,
    {
      action,
      actionNote: note,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  alert("Duyệt báo cáo thành công");
  onClose();
  if (onSuccess) onSuccess();
} catch (err) {
  const msg = err?.response?.data?.message || "Lỗi không xác định";
  alert("Duyệt thất bại: " + msg);
} finally {
  setLoading(false);
}
};

return (
<Dialog open={open} handler={onClose}>
<DialogHeader>Duyệt báo cáo</DialogHeader>
<DialogBody className="space-y-4">
<div>
<label className="block text-sm font-medium">Hành động</label>
<Select label="Chọn hành động" value={action} onChange={setAction}>
{actions.map((a) => (
<Option key={a.value} value={a.value}>
{a.label}
</Option>
))}
</Select>
</div>
<div>
<label className="block text-sm font-medium">Ghi chú</label>
<Input
label="Nhập ghi chú"
value={note}
onChange={(e) => setNote(e.target.value)}
/>
</div>
</DialogBody>
<DialogFooter>
<Button variant="text" onClick={onClose} className="mr-2">
Hủy
</Button>
<Button color="green" onClick={handleApprove} disabled={loading}>
{loading ? "Đang xử lý..." : "Xác nhận"}
</Button>
</DialogFooter>
</Dialog>
);
}