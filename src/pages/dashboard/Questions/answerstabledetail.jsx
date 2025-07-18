import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const FILE_BASE_URL = "https://api-ndolv2.nongdanonline.cc";

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

    const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
        })
    : "—";
  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Chi tiết câu trả lời</DialogHeader>
      <DialogBody divider className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="Tên Farm" value={data.farm?.name} />
        <InfoRow label="Chủ sở hữu" value={data.farm?.ownerName} />

        <InfoRow label="Tên Câu hỏi" value={data.question?.text} />
        <InfoRow label="Ngày tạo" value={formattedDate} />

        <InfoRow
          label="Đáp án đã chọn"
          value={data.selectedOptions?.join(", ")}
        />
        <InfoRow label="Khác" value={data.otherText} />

        <div className="col-span-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Tệp đính kèm:
          </Typography>
          {data.uploadedFiles?.length > 0 ? (
            data.uploadedFiles.map((file, idx) => (
              <a
                key={idx}
                href={`${FILE_BASE_URL}${file}`}
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