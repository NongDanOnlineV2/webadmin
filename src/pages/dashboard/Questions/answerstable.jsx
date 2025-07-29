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
import { BaseUrl } from "@/ipconfig";
import axios from "axios";

const API_URL = `${BaseUrl}/answers`;

let token = localStorage.getItem("token");

export function AnswersTable() {
  const [allAnswers, setAllAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;


  const [uploading, setUploading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [searchFarmName, setSearchFarmName] = useState("");
  const [isSearching, setIsSearching] = useState(false); 
console.log(allAnswers)
 
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const loadAnswersByPage = async (page = 1, searchMode = false) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}?limit=${itemsPerPage}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = res.data.data || [];
      if (searchMode && searchFarmName.trim()) {
        const search = searchFarmName.toLowerCase();
        data = data.filter(ans =>
          ans.farmName?.toLowerCase().includes(search)
        );
      }
      setAllAnswers(data);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setAllAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswersByPage(1, false);
  }, []);

  const handleDelete = async (id, item) => {
    if (!window.confirm(`Xóa đáp án của Farm: ${farmMap[item.farmId]}?`)) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) alert((await res.json()).message);
      alert("✅ Xóa thành công!");
      loadAnswersByPage(currentPage, isSearching);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

 


  const handleRowClick = (item) => {
    setSelectedAnswer(item);
    setDetailOpen(true);
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
                onClick={() => handleRowClick(item)}
              >
                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td >{ truncateText(item.farmName,20)  }</td>
                <td title={item.questionText}>{truncateText(item.questionText, 10)}</td>
                <td>
                  {item.selectedOptions?.map((opt, i) => (
                    <span key={i} className="bg-blue-100 text-xs px-2 py-1 rounded mr-1">
                      {truncateText(opt, 20)}
                    </span>
                  ))}
                </td>
                <td>
                  {truncateText(item.otherText, 20)}
                  
                  </td>
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


      <AnswersTableDetail open={detailOpen} onClose={() => setDetailOpen(false)} data={selectedAnswer} />
    </div>
  );
}


export default AnswersTable;

