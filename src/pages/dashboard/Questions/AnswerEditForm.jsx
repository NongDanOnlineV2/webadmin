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

const AnswerEditForm = ({
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
        <DialogHeader>Đang tải dữ liệu chỉnh sửa...</DialogHeader>
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
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Chỉnh sửa câu trả lời</DialogHeader>
      <DialogBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <Typography variant="small" className="mb-1 font-medium">Tên Farm</Typography>
            <Input
              value={form.farmName}
              onChange={(e) => setForm({ ...form, farmName: e.target.value })}
              crossOrigin=""
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">Chủ sở hữu</Typography>
            <Input
              value={form.farmOwner}
              onChange={(e) => setForm({ ...form, farmOwner: e.target.value })}
              crossOrigin=""
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">Tên Câu hỏi</Typography>
            <Input
              value={form.questionText}
              onChange={(e) =>
                setForm({ ...form, questionText: e.target.value })
              }
              crossOrigin=""
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">Ngày tạo</Typography>
            <Input
              value={form.createdAt || ""}
              onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
              crossOrigin=""
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">Đáp án đã chọn</Typography>
            <Input
              value={form.selectedOptions.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  selectedOptions: e.target.value
                    .split(",")
                    .map((opt) => opt.trim())
                    .filter(Boolean),
                })
              }
              crossOrigin=""
            />
          </div>

          <div>
            <Typography variant="small" className="mb-1 font-medium">Khác</Typography>
            <Input
              value={form.otherText}
              onChange={(e) =>
                setForm({ ...form, otherText: e.target.value })
              }
              crossOrigin=""
            />
          </div>

          <div className="sm:col-span-2">
            <Typography variant="small" className="mb-1 font-medium">Tệp đính kèm</Typography>
            <Input type="file" onChange={handleUploadImage} />
            {uploading && (
              <Typography className="text-sm text-gray-500 mt-1">
                Đang tải lên...
              </Typography>
            )}
            {form.uploadedFiles?.length > 0 &&
              form.uploadedFiles.map((file, i) => (
                <a
                  key={i}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline block mt-1"
                >
                  File {i + 1}
                </a>
              ))}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Huỷ
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AnswerEditForm;
