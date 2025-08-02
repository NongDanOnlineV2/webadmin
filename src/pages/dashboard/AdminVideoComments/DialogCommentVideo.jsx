import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

const DialogCommentVideo = ({ open, handleClose, videoId }) => {
  const token = localStorage.getItem('token');
  const [commentVideoById, setCommentVideoById] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCommentsVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl()}/video-comment/admin/${videoId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 200) {
        setCommentVideoById(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommentVideo = async (commentId, index) => {
    if (!window.confirm('Bạn có chắc chắn muốn ẩn bình luận này?')) return;

    try {
      setLoading(true);
      
      const res = await axios.delete(`${BaseUrl()}/video-comment/admin/${videoId}/comment/${index}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        alert('Ẩn bình luận thành công!');
        await getCommentsVideo(); 
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      alert('Lỗi khi ẩn bình luận!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && videoId) getCommentsVideo();
  }, [open, videoId]);

  return (
    <Dialog open={open} handler={handleClose} size="lg">
      <DialogHeader>Danh sách bình luận của video</DialogHeader>
      <DialogBody>
        {loading ? (
          <div className="flex justify-center items-center py-8">Đang tải...</div>
        ) : commentVideoById.length > 0 ? (
          <div className="space-y-6">
            {commentVideoById.map((item, idx) => (
              <div key={item._id || idx} className={`p-4 rounded-lg shadow flex flex-col gap-2 ${
                item.status === false 
                  ? 'bg-red-100 border border-red-300 opacity-60' 
                  : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`break-all font-semibold ${
                    item.status === false ? 'text-red-500' : 'text-blue-700'
                  }`}>
                    {item.user?.fullName || "Ẩn danh"}
                  </span>
                  <span className="break-all text-xs text-gray-500">({item.user?.email || "Không có email"})</span>
                  {item.status === false && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">ĐÃ ẨN</span>
                  )}
                  <span className="break-all ml-auto text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                  <Button
                    size="sm"
                    color={item.status === false ? "gray" : "red"}
                    onClick={() => deleteCommentVideo(item._id, idx)}
                    className="ml-2 px-2 py-1"
                    disabled={item.status === false}
                  >
                    {item.status === false ? "Đã ẩn" : "Ẩn"}
                  </Button>
                </div>
                <div className={`${
                  item.status === false ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {item.comment || <span className="italic text-gray-400">Không có nội dung</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Không có bình luận nào cho video này.</div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button color="blue" onClick={handleClose}>Đóng</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default DialogCommentVideo;