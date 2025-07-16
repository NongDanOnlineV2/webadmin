import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

const AnswerAddForm = ({
  open,
  setOpen,
  form,
  setForm,
  uploading,
  handleUploadImage,
  handleSubmit,
}) => {
  if (!form) {
    return (
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Đang chuẩn bị biểu mẫu...</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph">Vui lòng đợi...</Typography>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} handler={() => setOpen(false)}>
      <DialogHeader>Thêm mới câu trả lời</DialogHeader>
      <DialogBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên Farm"
          value={form.farmId}
          onChange={(e) => setForm({ ...form, farmId: e.target.value })}
          crossOrigin=""
        />
        <Input
          label="Nội dung Câu hỏi"
          value={form.questionId}
          onChange={(e) => setForm({ ...form, questionId: e.target.value })}
          crossOrigin=""
        />
        <Input
          label="Đáp án chọn (ngăn cách bằng dấu phẩy)"
          value={form.selectedOptions.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              selectedOptions: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
        <Input
          label="Câu trả lời (khác)"
          value={form.otherText}
          onChange={(e) => setForm({ ...form, otherText: e.target.value })}
        />
        <Input type="file" onChange={handleUploadImage} />
        {uploading && (
          <span className="text-sm text-gray-500">Đang tải lên...</span>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Huỷ
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Tạo mới
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AnswerAddForm;
