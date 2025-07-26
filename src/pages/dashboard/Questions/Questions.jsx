import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Oval } from 'react-loader-spinner';
import AddQuestion from './AddQuestion';
import AnswersTable from './answerstable';
import {
  MenuHandler, Menu, IconButton, MenuList, MenuItem,
  Input, Dialog, DialogBody, DialogHeader, DialogFooter, Button
} from '@material-tailwind/react';
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import EditQuestion from './EditQuestion';

export const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ state chính để lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // ✅ state tạm để nhập trước khi bấm tìm
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempFilterType, setTempFilterType] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });
  const [addDialog, setAddDialog] = useState(false);
  const [addValue, setAddValue] = useState({ text: '', options: [''], type: 'option', link: '' });
  const [showAnswersDialog, setShowAnswersDialog] = useState(false);

  const tokenUser = localStorage.getItem('token');

  // ✅ Load dữ liệu (hỗ trợ filter từ API nếu có)
  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BaseUrl}/admin-questions?page=${page}&limit=5&search=${searchTerm}&type=${filterType}`,
        { headers: { Authorization: `Bearer ${tokenUser}` } }
      );
      if (res.status === 200) {
        setQuestions(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.log('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage, searchTerm, filterType]);

  // ✅ Dialog sửa
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
    if (['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData?.type) && typeof idx === 'number') {
      const newOptions = [...editValue.options];
      newOptions[idx] = e.target.value;
      setEditValue({ ...editValue, options: newOptions });
    } else {
      setEditValue({ ...editValue, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!editValue.text || editValue.text.trim() === '') {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    if (
      ['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editValue.type) &&
      editValue.options.some(opt => !opt || opt.trim() === '')
    ) {
      alert('Vui lòng điền đủ tất cả các đáp án!');
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
      alert('Lỗi khi xóa!');
      console.log('Lỗi khi xóa:', error);
    }
  };

  // ✅ Dialog thêm
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
    if (["option", "single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) && addValue.options.some(opt => !opt || opt.trim() === '')) {
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
      alert('Lỗi khi thêm!');
      console.log('Lỗi khi thêm:', error);
    }
  };

  // ✅ Nếu muốn lọc phía client (khi API chưa hỗ trợ)
  const filteredQuestions = questions.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* 🔹 Thanh tìm kiếm + lọc */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
          className="h-10 w-64 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-sm"
        />

        <select
          className="h-10 w-48 px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={tempFilterType}
          onChange={(e) => setTempFilterType(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          <option value="single-choice">Chọn 1 đáp án</option>
          <option value="multi-choice">Chọn nhiều đáp án</option>
          <option value="multiple-choice">upload file</option>
          <option value="option">nhập đáp án</option>
        </select>

        {/* ✅ Nút tìm kiếm */}
        <button
          className="h-10 px-5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            setSearchTerm(tempSearchTerm);
            setFilterType(tempFilterType);
            setCurrentPage(1);  // ✅ Reset về trang đầu
            getData(1);         // ✅ Gọi lại API
          }}
        >
          Tìm kiếm
        </button>
      </div>

      {/* Dialog hiển thị câu trả lời */}
      <Dialog open={showAnswersDialog} handler={() => setShowAnswersDialog(false)} size="xl">
        <DialogHeader>Danh sách câu trả lời</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          <AnswersTable />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setShowAnswersDialog(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      {/* Danh sách câu hỏi */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Oval height={80} width={80} color="blue" visible={true} ariaLabel="oval-loading" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Không có câu hỏi phù hợp.</div>
      ) : (
        filteredQuestions.map((item) => (
          <div key={item._id} className="mb-6 p-4 border rounded-lg bg-white shadow">
            <div className="flex justify-between">
              <div className="font-semibold mb-2">{item.text}</div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton variant="text">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => handleOpenDialog(item)}>Cập nhật</MenuItem>
                  <MenuItem onClick={() => handleDelete(item._id)} className="text-red-500">Xoá</MenuItem>
                  <MenuItem onClick={handleOpenAddDialog}>Thêm câu hỏi</MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className="flex gap-4 mt-8 flex-wrap">
              {["single-choice", "multiple-choice", "multi-choice", "option"].includes(item.type) ? (
                item.options?.map((opt, idx) => (
                  <button key={idx} className="px-4 py-2 bg-blue-gray-400 hover:bg-blue-gray-600 text-white rounded">
                    {opt}
                  </button>
                ))
              ) : item.type === 'upload' ? (
                <input type="file" accept="image/*" className="border px-3 py-2 rounded w-full max-w-xs" disabled />
              ) : item.type === 'link' ? (
                <input type="url" className="border px-3 py-2 rounded w-full max-w-xs" placeholder="Nhập đường dẫn..." disabled />
              ) : item.type === 'text' ? (
                <input type="text" className="border px-3 py-2 rounded w-full max-w-xs" placeholder="Nhập câu trả lời..." disabled />
              ) : null}
            </div>
          </div>
        ))
      )}

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trang trước
        </Button>
        <span className="text-sm text-gray-700">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage >= totalPages}
        >
          Trang sau
        </Button>
      </div>

      {/* Dialog chỉnh sửa câu hỏi */}
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
