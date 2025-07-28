import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import AnswerEditForm from "./AnswerEditForm";
import { Audio } from "react-loader-spinner";
import { BaseUrl } from "@/ipconfig";

export default function AnswersTable() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/answers`);
      setAnswers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách câu trả lời:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const openEditForm = (data) => {
    setForm({
      _id: data._id,
      farmId: typeof data.farmId === "string" ? data.farmId : "",
      farmName: typeof data.farm?.name === "string" ? data.farm?.name : "",
      farmOwner: typeof data.farm?.ownerName === "string" ? data.farm?.ownerName : "",
      questionId: typeof data.questionId === "string" ? data.questionId : "",
      questionText: typeof data.question?.text === "string" ? data.question?.text : "",
      createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString("vi-VN") : "",
      selectedOptions: Array.isArray(data.selectedOptions) ? [...data.selectedOptions] : [],
      otherText: typeof data.otherText === "string" ? data.otherText : "",
      uploadedFiles: Array.isArray(data.uploadedFiles) ? [...data.uploadedFiles] : [],
    });
    setOpenEdit(true);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(`${BaseUrl}/upload`, formData);
      const url = res.data.url;
      setForm((prev) => ({
        ...prev,
        uploadedFiles: [...(prev.uploadedFiles || []), url],
      }));
    } catch (error) {
      console.error("Lỗi upload file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form._id) {
      alert("Không có ID câu trả lời để cập nhật.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.put(`${BaseUrl}/answers/${form._id}`, {
        selectedOptions: form.selectedOptions,
        otherText: form.otherText,
        uploadedFiles: form.uploadedFiles,
      });
      alert("Cập nhật thành công");
      setOpenEdit(false);
      fetchAnswers();
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
<Typography variant="h4" className="mb-4">
        Danh sách câu trả lời
      </Typography>
      {loading ? (
        <div className="flex justify-center">
          <Audio height={80} width={80} color="blue" ariaLabel="loading" />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-left border">
            <thead>
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Farm</th>
                <th className="border px-4 py-2">Câu hỏi</th>
                <th className="border px-4 py-2">Ngày tạo</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((ans, index) => (
                <tr key={ans._id} className="border-t">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{ans.farm?.name}</td>
                  <td className="border px-4 py-2">{ans.question?.text}</td>
                  <td className="border px-4 py-2">
                    {new Date(ans.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="border px-4 py-2">
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <IconButton variant="text">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem onClick={() => openEditForm(ans)}>
                          Chỉnh sửa
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnswerEditForm
        open={openEdit}
        setOpen={setOpenEdit}
        form={form}
        setForm={setForm}
        uploading={uploading}
        handleUploadImage={handleUploadImage}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}