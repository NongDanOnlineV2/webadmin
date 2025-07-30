import React, { useEffect } from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from '@material-tailwind/react'

export const AddQuestion = ({
  handleAddChange,
  handleAddSave,
  handleCloseAddDialog,
  addValue,
  setAddValue,
  open
}) => {
  useEffect(() => {
    if (open && ["single-choice", "multi-choice", "multiple-choice"].includes(addValue.type)) {
      if (!Array.isArray(addValue.options) || addValue.options.length < 2) {
        setAddValue({ ...addValue, options: ['', '{text}'] });
      } else if (
        Array.isArray(addValue.options) &&
        !addValue.options.includes('{text}')
      ) {
        setAddValue({ ...addValue, options: [...addValue.options, '{text}'] });
      }
    }
    if (open && !["single-choice", "multi-choice", "multiple-choice"].includes(addValue.type)) {
      setAddValue({ ...addValue, options: [] });
    }
    // eslint-disable-next-line
  }, [open, addValue.type]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let options;
    if (["single-choice", "multi-choice", "multiple-choice"].includes(type)) {
      options = ['', '{text}'];
    } else {
      options = [];
    }
    setAddValue({ ...addValue, type, options });
  };

  const handleRequiredChange = (e) => {
    setAddValue({ ...addValue, isRequired: e.target.checked });
  };

  const handleAddOption = () => {
    const opts = addValue.options;
    const idxText = opts.indexOf('{text}');
    let newOpts;
    if (idxText !== -1) {
      newOpts = [...opts.slice(0, idxText), '', ...opts.slice(idxText)];
    } else {
      newOpts = [...opts, ''];
    }
    setAddValue({ ...addValue, options: newOpts });
  };
  const handleRemoveOption = (idx) => {
    if (addValue.options[idx] === '{text}') return;
    const newOptions = addValue.options.filter((_, i) => i !== idx);
    setAddValue({ ...addValue, options: newOptions });
  };

  return (
    <Dialog open={open} handler={handleCloseAddDialog} size="md">
      <DialogHeader>Thêm câu hỏi mới</DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
          <Input
            name="text"
            value={addValue.text}
            onChange={handleAddChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
          <select
            name="type"
            value={addValue.type}
            onChange={handleTypeChange}
            className="border px-3 py-2 rounded w-full mb-2"
          >
            <option value="">-- Chọn loại câu hỏi --</option>
            <option value="single-choice">Chọn 1 đáp án</option>
            <option value="multi-choice">Chọn nhiều đáp án</option>
            <option value="text">Nhập thông tin</option>
            <option value="upload">Upload ảnh</option>
          </select>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="isRequired"
            checked={!!addValue.isRequired}
            onChange={handleRequiredChange}
            className="w-4 h-4"
          />
          <label htmlFor="isRequired" className="text-sm font-medium select-none">
            Yêu cầu bắt buộc phải điền
          </label>
        </div>
        {["single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) && Array.isArray(addValue.options) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tùy chọn đáp án</label>
            {addValue.options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <span className="w-6 text-gray-500 font-semibold">{String.fromCharCode(65 + idx)}.</span>
                {opt === '{text}' ? (
                  <span className="italic text-blue-700 bg-blue-50 px-3 py-2 rounded w-full">Khác (user sẽ nhập đáp án)</span>
                ) : (
                  <Input
                    value={opt}
                    onChange={e => handleAddChange(e, idx)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                  />
                )}
                <Button
                  type="button"
                  color="red"
                  onClick={() => handleRemoveOption(idx)}
                  disabled={addValue.options.length <= 2 || opt === '{text}'}
                  title={opt === '{text}' ? 'Không thể xóa đáp án Khác' : (addValue.options.length <= 2 ? 'Phải có ít nhất 1 đáp án thường và 1 đáp án Khác' : 'Xóa đáp án')}
                >
                  Xóa
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                color="green"
                onClick={handleAddOption}
              >
                Thêm đáp án lựa chọn
              </Button>
            </div>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="outlined"
          onClick={handleCloseAddDialog}
          className="mr-2"
        >
          Hủy
        </Button>
        <Button
          color="blue"
          onClick={handleAddSave}
        >
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddQuestion