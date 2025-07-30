import { Dialog,DialogHeader,DialogBody,Input,Button,DialogFooter } from "@material-tailwind/react";
const AnswerEditForm = ({
  open,
  setOpen,
  form,
  setForm,
  uploading,
  handleUploadImage,
  handleSubmit,
  
}) => {
  if (!form) return null;

  return (
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Chỉnh sửa đáp án</DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Farm</label>
          <Input value={form.farmName || ""} disabled />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Câu hỏi</label>
          <Input value={form.questionText || ""} disabled />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Đáp án chọn</label>
          <Input
            value={form.selectedOptions?.join(", ")}
            onChange={e =>
              setForm({ ...form, selectedOptions: e.target.value.split(",").map(s => s.trim()) })
            }
          />
        </div>
        {/* Option "Khác" cho phép user nhập tự do */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Đáp án khác (user nhập tự do)</label>
          <Input
            value={form.otherText || ""}
            onChange={e => setForm({ ...form, otherText: e.target.value })}
            placeholder="Nhập đáp án khác..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tệp đính kèm</label>
          <div className="flex flex-col gap-2">
            {form.uploadedFiles?.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                📎 File {idx + 1}
              </a>
            ))}
            <input type="file" onChange={handleUploadImage} disabled={uploading} />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" onClick={() => setOpen(false)} className="mr-2">
          Đóng
        </Button>
        <Button color="blue" onClick={handleSubmit} disabled={uploading}>
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default AnswerEditForm