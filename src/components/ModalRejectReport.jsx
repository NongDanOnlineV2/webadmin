import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { BaseUrl } from "@/ipconfig";

export default function ModalRejectReport({
  open,
  onClose,
  reportId,
  token,
  onSuccess,
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!note) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${BaseUrl}/admin-reports/${reportId}/approve`, // vẫn gọi approve
        {
          action: "REJECT",
          actionNote: note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Từ chối báo cáo thành công");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || "Lỗi không xác định";
      alert("Từ chối thất bại: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Từ chối báo cáo</DialogHeader>
      <DialogBody className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Lý do</label>
          <Input
            label="Nhập lý do"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose} className="mr-2">
          Hủy
        </Button>
        <Button color="red" onClick={handleReject} disabled={loading}>
          {loading ? "Đang xử lý..." : "Từ chối"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
