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

const InfoRow = ({ label, value, maxLength = 50 }) => {
  let displayValue = value;
  if (typeof value === "string" && value.length > maxLength) {
    displayValue = value.substring(0, maxLength) + "...";
  }
  return (
    <div className="mb-2">
      <Typography variant="small" color="blue-gray" className="font-medium ">
        {label}:
      </Typography>
      <Typography variant="small" color="gray">
        {displayValue || <i className="text-gray-400">—</i>}
      </Typography>
    </div>
  );
};

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
      <DialogBody divider className="  gap-4">
        <InfoRow label="Tên Farm" value={data.farmName} maxLength={50} />
        {/* <InfoRow label="Chủ sở hữu" value={data.farm?.ownerName} /> */}
        <InfoRow label="Tên Câu hỏi" value={data.questionText} maxLength={80} />
        <div className="col-span-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Đáp án đã chọn:
          </Typography>
          {Array.isArray(data.selectedOptions) && data.selectedOptions.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 text-sm mt-1">
              {data.selectedOptions.map((option, idx) => (
                <li key={idx}>
                  {typeof option === "string" && option.length > 80
                    ? option.substring(0, 80) + "..."
                    : option}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="small" color="gray">
              Không có
            </Typography>
          )}
        </div>

        <InfoRow label="Khác (Văn bản khác)" value={data.otherText||"Không có"} />
        {/* <InfoRow label="Date create" value={formatDate(data.createdAt)} />
        <InfoRow label="Date updated" value={formatDate(data.updatedAt)} /> */}

        <div className="col-span-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Tệp đính kèm:
          </Typography>
          {data.uploadedFiles?.length > 0 ? (
            data.uploadedFiles.map((file, idx) => (
              <a
                key={idx}
                href={`${BaseUrl}/${file}`}
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
