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

const deleteCommentVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl()}/video-comment/admin/${videoId}/comment/${index}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 200) {
        await getCommentsVideo()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

console.log(commentVideoById)
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
              <div key={item._id || idx} className="p-4 bg-gray-50 rounded-lg shadow flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="break-all font-semibold text-blue-700">{item.user?.fullName || "Ẩn danh"}</span>
                  <span className="break-all text-xs text-gray-500">({item.user?.email || "Không có email"})</span>
                  <span className="break-all ml-auto text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                </div>
                <div className="text-gray-900">{item.comment || <span className="italic text-gray-400">Không có nội dung</span>}</div>
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