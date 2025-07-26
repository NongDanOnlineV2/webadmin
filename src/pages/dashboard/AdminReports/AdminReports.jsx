import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import Pagination from '@/components/Pagination';
import ModalApproveReport from "@/components/ModalApproveReport"; // hoặc đường dẫn tương ứng
export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [openApprove, setOpenApprove] = useState(false);
const [selectedReportId, setSelectedReportId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (status) query += `&status=${status}`;
      if (type) query += `&type=${type}`;

      const res = await axios.get(`${BaseUrl}/admin-reports${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi lấy báo cáo:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const confirm = window.confirm('Bạn chắc chắn muốn duyệt báo cáo này?');
    if (!confirm) return;
    try {
      await axios.post(`${BaseUrl}/admin-reports/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Duyệt thành công');
      fetchReports();
    } catch (err) {
      alert('Lỗi khi duyệt báo cáo');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, status, type]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quản lý báo cáo</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="NEW">Chưa xử lý</option>
          <option value="RESOLVED">Đã xử lý</option>
        </select>

        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Tất cả loại --</option>
          <option value="USER">Người dùng</option>
          <option value="POST">Bài viết</option>
          <option value="VIDEO_FARM">Video / Trang trại</option>
        </select>
      </div>

      {/* Bảng báo cáo */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Người báo cáo</th>
              <th className="px-4 py-2 text-left">Loại</th>
              <th className="px-4 py-2 text-left">Nội dung</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Ngày tạo</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Không có báo cáo nào
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} className="border-t">
                 <td className="px-4 py-2">
  {r.targetUser?.email ? r.targetUser.email.split("@")[0] : "Ẩn danh"}
</td>
                  <td className="px-4 py-2">
  <span
    className={`px-2 py-1 rounded text-xs font-semibold 
      ${
        r.type === "USER"
          ? "bg-blue-100 text-blue-800"
          : r.type === "POST"
          ? "bg-green-100 text-green-800"
          : r.type === "VIDEO_FARM"
          ? "bg-purple-100 text-purple-800"
          : "bg-gray-100 text-gray-800"
      }`}
  >
    {r.type}
  </span>
</td>
                  <td className="px-4 py-2">{r.reason}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Chi tiết
                    </button>
                 {r.status === 'NEW' && (
  <button
    onClick={() => {
      setSelectedReportId(r._id);
      setOpenApprove(true);
    }}
    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
  >
    Duyệt
  </button>
)}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-6">
        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>

      {/* Modal chi tiết */}
     {selectedReport && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setSelectedReport(null)}
  >
    <div
      className="bg-white rounded p-6 w-[90%] max-w-xl shadow-xl overflow-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold mb-4">Chi tiết báo cáo</h2>
      <div className="text-sm space-y-3">
        {/* <div>
          <strong>ID:</strong> {selectedReport._id}
        </div> */}

        <div>
          <strong>Người báo cáo:</strong>{' '}
          {selectedReport.reporter ? (
            <div className="flex items-center gap-2 mt-1">
              <img
                src={selectedReport.reporter.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{selectedReport.reporter._id}</span>
            </div>
          ) : (
            'Ẩn danh'
          )}
        </div>

        <div>
          <strong>Đối tượng bị báo cáo:</strong>
          {selectedReport.targetUser ? (
            <div className="flex items-center gap-2 mt-1">
              <img
                src={selectedReport.targetUser.avatar}
                alt="target"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{selectedReport.targetUser._id}</span>
            </div>
          ) : (
            'Không rõ'
          )}
        </div>

        <div>
          <strong>Lý do:</strong> {selectedReport.reason}
        </div>
        <div>
          <strong>Loại:</strong> {selectedReport.type}
        </div>
        <div>
          <strong>Trạng thái:</strong> {selectedReport.status}
        </div>
        <div>
          <strong>Thời gian tạo:</strong>{' '}
          {new Date(selectedReport.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Cập nhật lần cuối:</strong>{' '}
          {new Date(selectedReport.updatedAt).toLocaleString()}
        </div>
        <div>
          <strong>Hành động xử lý:</strong>{' '}
          {selectedReport.handledAction || 'Chưa xử lý'}
        </div>
      </div>
      <div className="text-right mt-6">
        <button
          onClick={() => setSelectedReport(null)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}
{/* modal duyệt */}
    <ModalApproveReport
      open={openApprove}
      onClose={() => setOpenApprove(false)}
      reportId={selectedReportId}
      token={token}
      onSuccess={() => {
        setOpenApprove(false);
        fetchReports();
      }}
    />

    </div>
  );
}
