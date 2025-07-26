import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { BaseUrl } from "@/ipconfig";

const InfoRow = ({ label, value }) => (
  <div className="mb-2">
    <Typography variant="small" color="blue-gray" className="font-medium">
      {label}:
    </Typography>
    <Typography variant="small" color="gray">
      {value || <i className="text-gray-400">—</i>}
    </Typography>
  </div>
);

const AnswersTableDetail = ({ open, onClose, data }) => {
  if (!data) return null;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString("vi-VN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Không có dữ liệu";

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Chi tiết câu trả lời</DialogHeader>
      <DialogBody divider className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="ID trang trại" value={data.farmId} />
        <InfoRow label="Tên Farm" value={data.farm?.name} />
        <InfoRow label="Chủ sở hữu" value={data.farm?.ownerName} />
        <InfoRow label="Mã câu hỏi" value={data.questionId} />
        <InfoRow label="Tên Câu hỏi" value={data.question?.text} />

        <div className="col-span-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Đáp án đã chọn:
          </Typography>
          {data.selectedOptions?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 text-sm mt-1">
              {data.selectedOptions.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="small" color="gray">
              Không có
            </Typography>
          )}
        </div>

        <InfoRow label="Khác (Văn bản khác)" value={data.otherText} />
        <InfoRow label="Date create" value={formatDate(data.createdAt)} />
        <InfoRow label="Date updated" value={formatDate(data.updatedAt)} />

        <div className="col-span-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Tệp đính kèm:
          </Typography>
          {data.uploadedFiles?.length > 0 ? (
            data.uploadedFiles.map((file, idx) => (
              <a
                key={idx}
                href={`${BaseUrl}${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block"
              >
                File {idx + 1}
              </a>
            ))
          ) : (
            <Typography variant="small" color="gray">
              Không có
            </Typography>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AnswersTableDetail;
