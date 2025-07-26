import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Audio } from "react-loader-spinner";
import axios from "axios";
import AnswersTableDetail from "./answerstabledetail";
import AnswerAddForm from "./AnswerAddForm";
import AnswerEditForm from "./AnswerEditForm";
import Select from "react-select";
import { BaseUrl } from "@/ipconfig";

const API_URL = `${BaseUrl}/answers`;
let token = localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshRes = await fetch(
      "https://api-ndolv2.nongdanonline.cc/auth/refresh-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem("token", refreshData.accessToken);
      token = refreshData.accessToken;
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      throw new Error("Vui lòng đăng nhập lại!");
    }
  }

  return res;
};

export function AnswersTable() {
  const [allAnswers, setAllAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [formType, setFormType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    farmId: "",
    questionId: "",
    selectedOptions: [],
    otherText: "",
    uploadedFiles: [],
  });
  const [uploading, setUploading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [filterOptions, setFilterOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);

  const loadAnswersByPage = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_URL}?page=${page}&limit=${itemsPerPage}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Không thể tải dữ liệu");

      const answers = result.data || [];
      setAllAnswers(answers);
      setTotalPages(Math.ceil(result.total / itemsPerPage));
      setCurrentPage(page);

      // Lấy danh sách tất cả các đáp án có thể lọc
      const optionsSet = new Set();
      answers.forEach((ans) => {
        ans.selectedOptions?.forEach((opt) => optionsSet.add(opt));
      });
      setAllOptions(Array.from(optionsSet));
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setAllAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswersByPage(currentPage);
  }, []);

  const openAddForm = () => {
    setForm({
      farmId: "",
      questionId: "",
      selectedOptions: [],
      otherText: "",
      uploadedFiles: [],
    });
    setFormType("add");
    setEditData(null);
  };

  const openEditForm = (data) => {
    setForm({
      farmId: data.farmId || "",
      questionId: data.questionId || "",
      selectedOptions: data.selectedOptions || [],
      otherText: data.otherText || "",
      uploadedFiles: data.uploadedFiles || [],
    });
    setEditData(data);
    setFormType("edit");
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await fetchWithAuth(`${API_URL}/upload-image`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setForm((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, result.path],
      }));
    } catch (err) {
      alert(`Upload lỗi: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.farmId || !form.questionId) {
      alert("Vui lòng chọn Farm và Câu hỏi");
      return;
    }

    if (
      form.selectedOptions.length === 0 &&
      !form.otherText &&
      form.uploadedFiles.length === 0
    ) {
      alert("Vui lòng chọn ít nhất một đáp án hoặc nhập nội dung khác");
      return;
    }

    try {
      const payload = {
        farmId: form.farmId,
        questionId: form.questionId,
        selectedOptions: form.selectedOptions,
        otherText: form.otherText,
        uploadedFiles: form.uploadedFiles,
      };

      if (formType === "edit") {
        const res = await fetchWithAuth(`${API_URL}/${editData?._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        alert("✅ Cập nhật đáp án thành công!");
      } else {
        const res = await fetchWithAuth(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        alert("✅ Thêm đáp án thành công!");
      }

      setFormType(null);
      await loadAnswersByPage(currentPage);
    } catch (error) {
      console.error("Submit error:", error);
      alert(`❌ ${error.message || "Có lỗi xảy ra"}`);
    }
  };

  const handleDelete = async (id, item) => {
    const confirmMessage = `Bạn có chắc muốn xóa đáp án này?\n\nFarm ID: ${item.farmId}\nQuestion ID: ${item.questionId}\nĐáp án: ${item.selectedOptions?.join(", ") || "Không có"}`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Không thể xóa đáp án`);
      }
      alert("✅ Xóa đáp án thành công!");
      await loadAnswersByPage(currentPage);
    } catch (error) {
      console.error("Delete error:", error);
      alert(`❌ Lỗi khi xóa: ${error.message}`);
    }
  };

  const filteredAnswers = allAnswers.filter((item) => {
    if (filterOptions.length === 0) return true;
    return item.selectedOptions?.some((opt) =>
      filterOptions.map((f) => f.value).includes(opt)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">
          Danh sách câu trả lời 
        </Typography>
        <div className="flex gap-4 items-center">
          <div className="w-72">
            <Select
              isMulti
              options={allOptions.map((opt) => ({ value: opt, label: opt }))}
              value={filterOptions}
              onChange={setFilterOptions}
              placeholder="Lọc theo đáp án..."
            />
          </div>
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text">
                <EllipsisVerticalIcon className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={openAddForm}>Thêm mới</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Audio height="80" width="80" color="green" ariaLabel="loading" />
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Farm ID</th>
              <th className="px-4 py-3 text-left">Question ID</th>
              <th className="px-4 py-3 text-left">Đáp án chọn</th>
              <th className="px-4 py-3 text-left">Khác</th>
              <th className="px-4 py-3 text-left">Tệp đính kèm</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnswers.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setSelectedAnswer(item);
                  setDetailOpen(true);
                }}
              >
                <td className="px-4 py-3">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">{item.farmId}</td>
                <td className="px-4 py-3">{item.questionId}</td>
                <td className="px-4 py-3">
                  {item.selectedOptions?.map((opt, i) => (
                    <span key={i} className="bg-blue-100 text-xs text-blue-800 px-2 py-1 rounded mr-1">
                      {opt}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {item.otherText || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  {item.uploadedFiles?.length > 0 ? (
                    item.uploadedFiles.map((file, i) => (
                      <a
                        key={i}
                        href={`${BaseUrl}${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 underline text-xs block"
                      >
                        📎 File {i + 1}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <IconButton variant="text">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(item);
                        }}
                      >
                        Sửa đáp án
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id, item);
                        }}
                        className="text-red-500"
                      >
                        Xóa đáp án
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => loadAnswersByPage(currentPage - 1)}
        >
          Trang trước
        </Button>
        <span className="text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => loadAnswersByPage(currentPage + 1)}
        >
          Trang sau
        </Button>
      </div>

      <Dialog open={formType !== null} handler={() => setFormType(null)} size="xl">
        {formType === "add" ? (
          <AnswerAddForm
            open
            setOpen={() => setFormType(null)}
            form={form}
            setForm={setForm}
            uploading={uploading}
            handleUploadImage={handleUploadImage}
            handleSubmit={handleSubmit}
          />
        ) : formType === "edit" ? (
          <AnswerEditForm
            open
            setOpen={() => setFormType(null)}
            form={form}
            setForm={setForm}
            uploading={uploading}
            handleUploadImage={handleUploadImage}
            handleSubmit={handleSubmit}
          />
        ) : null}
      </Dialog>

      <AnswersTableDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={selectedAnswer}
      />
    </div>
  );
}

export default AnswersTable;
