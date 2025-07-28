import React from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from '@material-tailwind/react'

export const EditQuestion = ({
  open,
  editData,
  editValue,
  handleEditChange,
  handleSave,
  handleCloseDialog,
  setEditValue,
}) => {
  return (
    <Dialog open={open} handler={handleCloseDialog} size="md">
      <DialogHeader>Sửa câu hỏi</DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nội dung câu hỏi
          </label>
          <Input
            name="text"
            value={editValue.text}
            onChange={handleEditChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        {[ 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData?.type) && Array.isArray(editValue.options) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tùy chọn đáp án
            </label>
            {editValue.options.length === 0 && (
              <div className="text-gray-400 italic mb-2">
                Chưa có đáp án nào, hãy thêm đáp án mới.
              </div>
            )}
            {editValue.options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <span className="w-6 text-gray-500 font-semibold">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <Input
                  value={opt}
                  onChange={(e) => handleEditChange(e, idx)}
                  className="border px-3 py-2 rounded w-full"
                  placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                />
                <Button
                  type="button"
                  color="red"
                  onClick={() => {
                    const newOptions = editValue.options.filter((_, i) => i !== idx);
                    setEditValue({ ...editValue, options: newOptions });
                  }}
                  disabled={editValue.options.length <= 2}
                  title={editValue.options.length <= 2 ? 'Phải có ít nhất 2 đáp án' : 'Xóa đáp án'}
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              color="green"
              onClick={() =>
                setEditValue({
                  ...editValue,
                  options: [...editValue.options, ''],
                })
              }
              className="mt-2"
            >
              Thêm đáp án
            </Button>
          </div>
        )}
        {editData?.type === 'link' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Link</label>
            <Input
              name="link"
              value={editValue.link}
              onChange={handleEditChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        )}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="isRequired"
            checked={!!editValue.isRequired}
            onChange={e => setEditValue({ ...editValue, isRequired: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isRequired" className="text-sm font-medium select-none">
            Yêu cầu bắt buộc phải điền
          </label>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="outlined"
          onClick={handleCloseDialog}
          className="mr-2"
        >
          Hủy
        </Button>
        <Button
          color="blue"
          onClick={handleSave}
        >
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default EditQuestion