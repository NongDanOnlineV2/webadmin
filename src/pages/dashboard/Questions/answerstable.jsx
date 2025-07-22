import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Audio } from "react-loader-spinner";
import axios from "axios";
import AnswersTableDetail from "./answerstabledetail";
import AnswerAddForm from "./AnswerAddForm";
import AnswerEditForm from "./AnswerEditForm";
// import { toast } from "react-toastify";

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
  const [answers, setAnswers] = useState([]);
  const [questionAnFarmId, setQuestionAndFarmId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(API_URL);
      const data = await res.json();
      setAnswers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  const getFarmandQuestion = async () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentPageItems = answers.slice(startIndex, endIndex);

    try {
      const response = await Promise.all(
        currentPageItems.map(async (item) => {
          try {
            const [resQ, resF] = await Promise.all([
              axios.get(
                `https://api-ndolv2.nongdanonline.cc/admin-questions/${item.questionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ),
              axios.get(
                `https://api-ndolv2.nongdanonline.cc/adminfarms/${item.farmId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ),
            ]);

            return {
              ...item,
              question: resQ.data,
              farm: {
                ...resF.data,
                ownerName: resF.data.owner?.fullname || "—",
              },
            };
          } catch {
            return { ...item };
          }
        })
      );
      setQuestionAndFarmId(response);
    } catch {
      setQuestionAndFarmId([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  useEffect(() => {
    if (answers.length > 0) {
      getFarmandQuestion();
    }
  }, [currentPage, answers]);

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
    const payload =
      formType === "edit"
        ? {
            farmId: form.farmId,
            questionId: form.questionId,
            selectedOptions: form.selectedOptions,
            otherText: form.otherText,
            uploadedFiles: form.uploadedFiles,
          }
        : {
            farmId: form.farmId,
            answers: [
              {
                questionId: form.questionId,
                selectedOptions: form.selectedOptions,
                otherText: form.otherText,
                uploadedFiles: form.uploadedFiles,
              },
            ],
          };

    try {
      const url =
        formType === "edit" ? `${API_URL}/${editData?._id}` : API_URL;

      const method = formType === "edit" ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Không thể lưu dữ liệu");

      alert(
        formType === "edit"
          ? "Cập nhật câu trả lời thành công!"
          : "Thêm câu trả lời thành công!"
      );

      setFormType(null);
      fetchAnswers();
    } catch (error) {
      alert(error.message || "Không thể lưu dữ liệu");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Không thể xoá dữ liệu");
      fetchAnswers();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPages = Math.ceil(answers.length / itemsPerPage);

  const filteredData = questionAnFarmId.filter((item) => {
    const farmName = item.farm?.name?.toLowerCase() || "";
    const questionText = item.question?.text?.toLowerCase() || "";
    const selected = item.selectedOptions?.join(", ").toLowerCase() || "";

    return (
      (farmName.includes(searchText.toLowerCase()) ||
        questionText.includes(searchText.toLowerCase())) &&
      (!filterOption || selected.includes(filterOption.toLowerCase()))
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">Danh sách câu trả lời</Typography>
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

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 mb-4">
        <div className="sm:w-60">
          <Input
            label="Tìm kiếm câu hỏi hoặc farm"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="sm:w-64 mt-4 sm:mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lọc theo đáp án
          </label>
          <select
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            <option value="">Tất cả</option>
            {[...new Set(questionAnFarmId.flatMap((item) => item.selectedOptions || []))].map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Audio height="80" width="80" color="green" ariaLabel="loading" />
      ) : (
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left"></th>
              <th className="px-4 py-3 text-left">Farm</th>
              <th className="px-4 py-3 text-left">Câu hỏi</th>
              <th className="px-4 py-3 text-left">Đáp án chọn</th>
              <th className="px-4 py-3 text-left">Khác</th>
              <th className="px-4 py-3 text-left">Tệp đính kèm</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setSelectedAnswer(item);
                  setDetailOpen(true);
                }}
              >
                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-3">{item.farm?.name || <i className="text-gray-400">chưa có</i>}</td>
                <td className="px-4 py-3">{item.question?.text || <i className="text-gray-400">chưa có</i>}</td>
                <td className="px-4 py-3">{item.selectedOptions?.join(", ") || "—"}</td>
                <td className="px-4 py-3">{item.otherText || "—"}</td>
                <td className="px-4 py-3">
                  {item.uploadedFiles?.length > 0
                    ? item.uploadedFiles.map((file, i) => (
                        <a
                          key={i}
                          href={`${FILE_BASE_URL}${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline block"
                        >
                          File {i + 1}
                        </a>
                      ))
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <IconButton variant="text">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem onClick={(e) => { e.stopPropagation(); openEditForm(item); }}>Sửa</MenuItem>
                      <MenuItem
                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                        className="text-red-500"
                      >
                        Xoá
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
        <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Trang trước</Button>
        <span className="text-sm font-medium">Trang {currentPage} / {totalPages || 1}</span>
        <Button variant="outlined" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Trang sau</Button>
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

      <AnswersTableDetail open={detailOpen} onClose={() => setDetailOpen(false)} data={selectedAnswer} />
    </div>
  );
}

export default AnswersTable;
