import React, { useEffect } from 'react'
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
  // Đảm bảo chỉ thêm đáp án "{text}" đúng 1 lần khi mở dialog
  useEffect(() => {
    if (
      open &&
      ['single-choice', 'multiple-choice', 'multi-choice'].includes(editData?.type) &&
      Array.isArray(editValue.options)
    ) {
      // Giữ lại các đáp án thường, chỉ thêm "{text}" nếu chưa có hoặc nếu có nhiều thì chỉ giữ 1 ở cuối
      const filtered = editValue.options.filter(opt => opt !== '{text}');
      setEditValue({ ...editValue, options: [...filtered, '{text}'] });
    }
    // eslint-disable-next-line
  }, [open, editData?.type]);

  // Khi lưu, giữ nguyên các đáp án thường, chỉ giữ lại 1 đáp án "{text}" ở cuối nếu đã có
  const handleSafeSave = () => {
    let options = editValue.options;
    if (['single-choice', 'multiple-choice', 'multi-choice'].includes(editData?.type) && Array.isArray(options)) {
      // Lấy tất cả đáp án thường (không phải '{text}')
      const filtered = options.filter(opt => opt !== '{text}');
      // Nếu ban đầu đã có '{text}', thì thêm lại 1 ở cuối, nếu không thì chỉ lưu đáp án thường
      if (options.includes('{text}')) {
        options = [...filtered, '{text}'];
      } else {
        options = [...filtered];
      }
    }
    handleSave({ ...editValue, options });
  };

  const handleOptionChange = (e, idx) => {
    if (editValue.options[idx] === '{text}') return;
    handleEditChange(e, idx);
  };

  const handleAddOption = () => {
    const filtered = editValue.options.filter(opt => opt !== '{text}');
    setEditValue({ ...editValue, options: [...filtered, '', '{text}'] });
  };

  const handleRemoveOption = (idx) => {
    if (editValue.options[idx] === '{text}') return;
    const filtered = editValue.options.filter((_, i) => i !== idx && editValue.options[i] !== '{text}');
    setEditValue({ ...editValue, options: [...filtered, '{text}'] });
  };

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
                {opt === '{text}' ? (
                  <span className="italic text-blue-700 bg-blue-50 px-3 py-2 rounded w-full cursor-not-allowed select-none">
                    Khác (người dùng sẽ nhập đáp án)
                  </span>
                ) : (
                  <Input
                    value={opt}
                    onChange={e => handleOptionChange(e, idx)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                  />
                )}
                <Button
                  type="button"
                  color="red"
                  onClick={() => handleRemoveOption(idx)}
                  disabled={editValue.options.length <= 2 || opt === '{text}'}
                  title={opt === '{text}' ? 'Không thể xóa đáp án Khác' : (editValue.options.length <= 2 ? 'Phải có ít nhất 1 đáp án thường và 1 đáp án Khác' : 'Xóa đáp án')}
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              color="green"
              onClick={handleAddOption}
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
          onClick={handleSafeSave}
        >
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default EditQuestion