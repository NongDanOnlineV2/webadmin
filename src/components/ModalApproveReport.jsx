import React, { useEffect, useState } from "react";
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

export default function ModalApproveReport({
  open,
  onClose,
  reportId,
  reportType,
  token,
  onSuccess,
}) {
  const [action, setAction] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Tự động xác định action từ reportType
  useEffect(() => {
    if (reportType === "USER") setAction("DEACTIVATE_USER");
    else if (reportType === "POST") setAction("DELETE_POST");
    else if (reportType === "VIDEO_FARM") setAction("DELETE_VIDEO");
    else setAction("");
  }, [reportType]);

  const handleApprove = async () => {
    if (!action || !note) {
      alert("Vui lòng nhập lý do");
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
          <p className="text-blue-700 font-medium">
            {action || "Không xác định"}
          </p>
        </div>
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
        <Button color="green" onClick={handleApprove} disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
