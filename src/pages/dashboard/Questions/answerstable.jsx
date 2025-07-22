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
const API_URL = "https://api-ndolv2.nongdanonline.cc/answers";
const FILE_BASE_URL = "https://api-ndolv2.nongdanonline.cc";
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
  const [allAnswers, setAllAnswers] = useState([]); // Tất cả data
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [formType, setFormType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [allAnswersCache, setAllAnswersCache] = useState(null);
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

  // Load tất cả answers 1 lần duy nhất
  const loadAllAnswers = async () => {
    try {
      // Kiểm tra cache trước
      if (allAnswersCache) {
        console.log("📦 Load all answers từ cache");
        setAllAnswers(allAnswersCache);
        setTotalPages(Math.ceil(allAnswersCache.length / itemsPerPage));
        setLoading(false);
        return;
      }

      console.log("🔄 Gọi API load tất cả answers - 1 lần duy nhất");
      setLoading(true);

      const res = await fetchWithAuth(API_URL);
      const data = await res.json();
      const answersData = Array.isArray(data) ? data : [];

      setAllAnswers(answersData);
      setAllAnswersCache(answersData); // Cache tất cả
      setTotalPages(Math.ceil(answersData.length / itemsPerPage));
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setAllAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear cache function
  const clearCache = () => {
    console.log("🗑️ Clear cache");
    setAllAnswersCache(null);
  };

  useEffect(() => {
    loadAllAnswers();
  }, []);

  // Lấy data cho trang hiện tại - client-side pagination
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allAnswers.slice(startIndex, endIndex);
  };

  const currentPageData = getCurrentPageData();

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
    // Validate form
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
      if (formType === "edit") {
        // Sửa đáp án - gọi API PUT
        const payload = {
          farmId: form.farmId,
          questionId: form.questionId,
          selectedOptions: form.selectedOptions,
          otherText: form.otherText,
          uploadedFiles: form.uploadedFiles,
        };

        const res = await fetchWithAuth(`${API_URL}/${editData?._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Không thể cập nhật đáp án");

        alert("✅ Cập nhật đáp án thành công!");
      } else {
        // Thêm đáp án mới - gọi API POST
        const payload = {
          farmId: form.farmId,
          questionId: form.questionId,
          selectedOptions: form.selectedOptions,
          otherText: form.otherText,
          uploadedFiles: form.uploadedFiles,
        };

        const res = await fetchWithAuth(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Không thể thêm đáp án");

        alert("✅ Thêm đáp án thành công!");
      }

      setFormType(null);
      clearCache();
      await loadAllAnswers();

    } catch (error) {
      console.error("Submit error:", error);
      alert(`❌ ${error.message || "Có lỗi xảy ra"}`);
    }
  };

  const handleDelete = async (id, item) => {
    const confirmMessage = `Bạn có chắc muốn xóa đáp án này?\n\nFarm ID: ${item.farmId}\nQuestion ID: ${item.questionId}\nĐáp án: ${item.selectedOptions?.join(", ") || "Không có"}`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Không thể xóa đáp án (${res.status})`);
      }

      alert("✅ Xóa đáp án thành công!");
      clearCache();
      await loadAllAnswers();

    } catch (error) {
      console.error("Delete error:", error);
      alert(`❌ Lỗi khi xóa: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">
          Danh sách câu trả lời ({allAnswers.length} items)
        </Typography>
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
            {currentPageData.map((item, index) => (
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
                <td className="px-4 py-3">
                  <span className="text-gray-600 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {item.farmId}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {item.questionId}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs">
                    {item.selectedOptions?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.selectedOptions.map((option, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs truncate">
                    {item.otherText ? (
                      <span className="text-gray-700" title={item.otherText}>
                        {item.otherText}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.uploadedFiles?.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {item.uploadedFiles.map((file, i) => (
                        <a
                          key={i}
                          href={`${FILE_BASE_URL}${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📎 File {i + 1}
                        </a>
                      ))}
                    </div>
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
                        className="flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa đáp án
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id, item);
                        }}
                        className="text-red-500 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
          onClick={() => setCurrentPage((p) => p - 1)}
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
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Trang sau
        </Button>
      </div>

      <Dialog
        open={formType !== null}
        handler={() => setFormType(null)}
        size="xl"
      >
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
