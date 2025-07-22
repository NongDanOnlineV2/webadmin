import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Oval } from 'react-loader-spinner';
import AddQuestion from './AddQuestion';
import AnswersTable from './answerstable';
import {
  MenuHandler,
  Menu,
  IconButton,
  MenuList,
  MenuItem,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import EditQuestion from './EditQuestion';

const Questions = () => {
  const tokenUser = localStorage.getItem('token');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });

  const [addDialog, setAddDialog] = useState(false);
  const [addValue, setAddValue] = useState({ text: '', options: [''], type: 'option', link: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [showAnswersDialog, setShowAnswersDialog] = useState(false);

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/admin-questions?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      if (res.status === 200) {
        setQuestions(res.data.data);
        setFilteredQuestions(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.log('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const handleOpenDialog = (item) => {
    setEditData(item);
    setEditValue({
      text: item.text,
      options: Array.isArray(item.options) ? [...item.options] : [],
      type: item.type,
      link: item.link || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
    setEditValue({ options: [] });
  };

  const handleEditChange = (e, idx) => {
    if (
      editData &&
      ['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData.type) &&
      typeof idx === 'number'
    ) {
      const newOptions = [...editValue.options];
      newOptions[idx] = e.target.value;
      setEditValue({ ...editValue, options: newOptions });
    } else {
      setEditValue({ ...editValue, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (
      ['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData.type) &&
      editValue.options.some(opt => !opt || opt.trim() === '')
    ) {
      alert('Vui lòng điền đủ tất cả các đáp án!');
      return;
    }
    if (!editValue.text || editValue.text.trim() === '') {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    try {
      await axios.put(`${BaseUrl}/admin-questions/${editData._id}`, editValue, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      alert("Lưu thành công");
      handleCloseDialog();
      getData(currentPage);
    } catch (error) {
      console.log('Lỗi khi cập nhật:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      await axios.delete(`${BaseUrl}/admin-questions/${id}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      alert('Xoá thành công!');
      getData(currentPage);
    } catch (error) {
      console.log('Lỗi khi xoá:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setAddValue({ text: '', options: [''], type: 'option', link: '' });
    setAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialog(false);
    setAddValue({ text: '', options: [''], type: 'option', link: '' });
  };

  const handleAddChange = (e, idx) => {
    if (["option", "single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) && typeof idx === "number") {
      const newOptions = [...addValue.options];
      newOptions[idx] = e.target.value;
      setAddValue({ ...addValue, options: newOptions });
    } else {
      setAddValue({ ...addValue, [e.target.name]: e.target.value });
    }
  };

  const handleAddSave = async () => {
    if (!addValue.text || addValue.text.trim() === '') {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    if (["option", "single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) &&
        addValue.options.some(opt => !opt || opt.trim() === '')) {
      alert('Vui lòng điền đủ tất cả các đáp án!');
      return;
    }

    try {
      await axios.post(`${BaseUrl}/admin-questions`, addValue, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      alert('Thêm thành công!');
      handleCloseAddDialog();
      getData(currentPage);
    } catch (error) {
      console.log('Lỗi khi thêm:', error);
    }
  };

  const handleFilter = () => {
    const keyword = searchTerm.toLowerCase().trim();
    const filtered = questions.filter(q => {
      const matchesText = q.text?.toLowerCase().includes(keyword);
      const matchesType = filterType === '' || q.type === filterType;
      return matchesText && matchesType;
    });
    setFilteredQuestions(filtered);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <AddQuestion
          handleAddChange={handleAddChange}
          handleAddSave={handleAddSave}
          handleCloseAddDialog={handleCloseAddDialog}
          handleOpenAddDialog={handleOpenAddDialog}
          addDialog={addDialog}
          addValue={addValue}
          setAddValue={setAddValue}
        />
      </div>

      <Dialog open={showAnswersDialog} handler={() => setShowAnswersDialog(false)} size="xl">
        <DialogHeader>Danh sách câu trả lời</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          <AnswersTable />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setShowAnswersDialog(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Tìm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-sm"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Tất cả loại</option>
          <option value="single-choice">Chọn nhiều đáp án</option>
          <option value="text">Nhập văn bản</option>
          <option value="link">Nhập đường dẫn</option>
          <option value="upload">Tải lên hình ảnh</option>
        </select>

        <Button size="sm" color="black" onClick={handleFilter}>Tìm kiếm</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Oval height={80} width={80} color="blue" visible={true} />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Không có câu hỏi nào.</div>
      ) : (
        filteredQuestions.map((item) => (
          <div key={item._id} className="mb-6 p-4 border rounded-lg bg-white shadow">
            <div className="flex justify-between">
              <div className="font-semibold mb-2">{item.text}</div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton variant="text"><EllipsisVerticalIcon className="h-5 w-5" /></IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => handleOpenDialog(item)}>Cập nhật</MenuItem>
                  <MenuItem onClick={() => handleDelete(item._id)} className="text-red-500">Xoá</MenuItem>
                  <MenuItem onClick={handleOpenAddDialog}>Thêm câu hỏi</MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className="flex gap-4 mt-8">
              {["single-choice", "multiple-choice", "multi-choice"].includes(item.type) && Array.isArray(item.options) ? (
                item.options.map((opt, idx) => (
                  <button key={idx} className="px-4 py-2 bg-blue-gray-400 text-white rounded">{opt}</button>
                ))
              ) : item.type === 'upload' ? (
                <input type="file" disabled className="border px-3 py-2 rounded w-full max-w-xs" />
              ) : item.type === 'link' ? (
                <input type="url" disabled className="border px-3 py-2 rounded w-full max-w-xs" placeholder="Nhập đường dẫn..." />
              ) : item.type === 'text' ? (
                <input type="text" disabled className="border px-3 py-2 rounded w-full max-w-xs" placeholder="Nhập câu trả lời..." />
              ) : null}
            </div>
          </div>
        ))
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <Button size="sm" variant="outlined" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Trang trước
        </Button>
        <span className="text-sm text-gray-700">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
        <Button size="sm" variant="outlined" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages}>
          Trang sau
        </Button>
      </div>

      <EditQuestion
        setEditValue={setEditValue}
        editData={editData}
        editValue={editValue}
        handleCloseDialog={handleCloseDialog}
        handleEditChange={handleEditChange}
        handleSave={handleSave}
        openDialog={openDialog}
      />
    </div>
  );
};

export default Questions;
