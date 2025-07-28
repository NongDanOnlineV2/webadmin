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
  Input,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Audio } from "react-loader-spinner";
import Select from "react-select";
import AnswersTableDetail from "./answerstabledetail";
import AnswerAddForm from "./AnswerAddForm";
import AnswerEditForm from "./AnswerEditForm";
import { BaseUrl } from "@/ipconfig";

const API_URL = `${BaseUrl}/answers`;
const FARM_API = `${BaseUrl}/farms`;
const QUESTION_API = `${BaseUrl}/questions`;
let token = localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshRes = await fetch(
      `${BaseUrl}/auth/refresh-token`,
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
        headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
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
  const [farmMap, setFarmMap] = useState({});
  const [questionMap, setQuestionMap] = useState({});
  const [searchFarmName, setSearchFarmName] = useState("");
  const [isSearching, setIsSearching] = useState(false); // ✅ kiểm soát search mode

  // ✅ Load toàn bộ options từ API
  // const loadAllOptions = async () => {
  //   try {
  //     const res = await fetchWithAuth(`${API_URL}?limit=9999`);
  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     const optionsSet = new Set();
  //     (result.data || []).forEach((ans) =>
  //       ans.selectedOptions?.forEach((opt) => optionsSet.add(opt))
  //     );

  //     setAllOptions(Array.from(optionsSet));
  //   } catch (err) {
  //     console.error("Lỗi tải options:", err);
  //   }
  // };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // ✅ Load danh sách câu trả lời
  const loadAnswersByPage = async (page = 1, searchMode = false) => {
    try {
      setLoading(true);
      const limit = searchMode ? 9999 : itemsPerPage;
      const res = await fetchWithAuth(`${API_URL}?limit=${limit}&page=${page}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      let data = result.data || [];

      // Nếu searchMode, chỉ lọc theo tên trang trại nếu có
      if (searchMode && searchFarmName.trim()) {
        const search = searchFarmName.toLowerCase();
        data = data.filter(ans =>
          ans.farmName?.toLowerCase().includes(search)
        );
      }

      // ✅ Phân trang client
      const startIndex = (page - 1) * itemsPerPage;
      const paginated = data.slice(startIndex, startIndex + itemsPerPage);

      setAllAnswers(paginated);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setCurrentPage(page);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setAllAnswers([]);
    } finally {
      setLoading(false);
    }
  };
console.log(allAnswers)
  const fetchFarmsAndQuestions = async () => {
    try {
      const [farmRes, questionRes] = await Promise.all([
        fetchWithAuth(FARM_API),
        fetchWithAuth(QUESTION_API),
      ]);

      if (!farmRes.ok) throw new Error(`FARM_API lỗi ${farmRes.status}`);
      if (!questionRes.ok) throw new Error(`QUESTION_API lỗi ${questionRes.status}`);

      const farmsData = await farmRes.json();
      const questionsData = await questionRes.json();

      const farmMapData = {};
      (farmsData.data || []).forEach((farm) => {
        farmMapData[farm._id] = farm.name;
      });
      setFarmMap(farmMapData);

      const questionMapData = {};
      (questionsData.data || []).forEach((q) => {
        questionMapData[q._id] = q.content;
      });
      setQuestionMap(questionMapData);
    } catch (err) {
      console.error("🚨 Lỗi tải farm/question:", err.message);
    }
  };

  // ✅ Lần đầu load chỉ 10 record
  useEffect(() => {
    loadAnswersByPage(1, false);
    fetchFarmsAndQuestions();
  }, []);

  // Form thêm/sửa
  const openAddForm = () => {
    setForm({ farmId: "", questionId: "", selectedOptions: [], otherText: "", uploadedFiles: [] });
    setFormType("add");
    setEditData(null);
  };

  // Sửa lại hàm openEditForm để không crash khi dữ liệu thiếu hoặc không đúng kiểu
  const openEditForm = (data) => {
    setForm({
      farmId: typeof data.farmId === "string" ? data.farmId : "",
      farmName: typeof data.farmName === "string" ? data.farmName : "",
      questionId: typeof data.questionId === "string" ? data.questionId : "",
      questionText: typeof data.questionText === "string" ? data.questionText : "",
      selectedOptions: Array.isArray(data.selectedOptions) ? [...data.selectedOptions] : [],
      otherText: typeof data.otherText === "string" ? data.otherText : "",
      uploadedFiles: Array.isArray(data.uploadedFiles) ? [...data.uploadedFiles] : [],
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
      const res = await fetchWithAuth(`${API_URL}/upload-image`, { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setForm((prev) => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, result.path] }));
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

    try {
      const payload = { ...form };
      const res = await fetchWithAuth(
        formType === "edit" ? `${API_URL}/${editData?._id}` : API_URL,
        {
          method: formType === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert(formType === "edit" ? "✅ Cập nhật đáp án thành công!" : "✅ Thêm đáp án thành công!");
      setFormType(null);
      loadAnswersByPage(currentPage, isSearching);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id, item) => {
    if (!window.confirm(`Xóa đáp án của Farm: ${farmMap[item.farmId]}?`)) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).message);
      alert("✅ Xóa thành công!");
      loadAnswersByPage(currentPage, isSearching);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        {/* BÊN TRÁI: Ô tìm kiếm */}
        <div className="flex items-end gap-3 flex-wrap">
          <div className="min-w-[200px]">
            <Input
              label="Tìm trang trại"
              value={searchFarmName}
              onChange={(e) => setSearchFarmName(e.target.value)}
            />
          </div>
          <Button
            className="bg-black text-white"
            onClick={() => {
              setIsSearching(true);
              loadAnswersByPage(1, true);
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Audio height="80" width="80" color="green" ariaLabel="loading" />
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Farm</th>
              <th className="px-4 py-3">Câu hỏi</th>
              <th className="px-4 py-3">Đáp án chọn</th>
              <th className="px-4 py-3">Khác</th>
              <th className="px-4 py-3">Tệp đính kèm</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {allAnswers.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedAnswer(item);
                  setDetailOpen(true);
                }}
              >
                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.farmName}</td>
                <td title={item.questionText}>{truncateText(item.questionText, 30)}</td>
                <td>
                  {item.selectedOptions?.map((opt, i) => (
                    <span key={i} className="bg-blue-100 text-xs px-2 py-1 rounded mr-1">
                      {opt}
                    </span>
                  ))}
                </td>
                <td>{item.otherText || "—"}</td>
                <td>
                  {item.uploadedFiles?.length > 0
                    ? item.uploadedFiles.map((f, i) => (
                        <a key={i} href={`${BaseUrl}${f}`} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs block">
                          📎 File {i + 1}
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
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(item);
                        }}
                      >
                        Sửa
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id, item);
                        }}
                        className="text-red-500"
                      >
                        Xóa
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={() => loadAnswersByPage(currentPage - 1, isSearching)}>
          Trang trước
        </Button>
        <span>Trang {currentPage}/{totalPages}</span>
        <Button variant="outlined" size="sm" disabled={currentPage >= totalPages} onClick={() => loadAnswersByPage(currentPage + 1, isSearching)}>
          Trang sau
        </Button>
      </div>

      {/* Form Add/Edit */}
      <Dialog open={formType !== null} handler={() => setFormType(null)} size="xl">
        {formType === "add" ? (
          <AnswerAddForm open setOpen={() => setFormType(null)} form={form} setForm={setForm} uploading={uploading} handleUploadImage={handleUploadImage} handleSubmit={handleSubmit} />
        ) : formType === "edit" ? (
          <AnswerEditForm open setOpen={() => setFormType(null)} form={form} setForm={setForm} uploading={uploading} handleUploadImage={handleUploadImage} handleSubmit={handleSubmit} />
        ) : null}
      </Dialog>

      {/* Chi tiết */}
      <AnswersTableDetail open={detailOpen} onClose={() => setDetailOpen(false)} data={selectedAnswer} />
    </div>
  );
}


export default AnswersTable;
