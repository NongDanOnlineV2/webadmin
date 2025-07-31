import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Card, Input, Button, Typography, Spinner,
} from "@material-tailwind/react";
import { BaseUrl } from "@/ipconfig";
const token = () => localStorage.getItem("token");

const fetchComments = (videoId) =>
  axios
    .get(`${BaseUrl()}/video-comment/${videoId}/comments`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
    .then((r) => r.data);

const addComment = (videoId, body) =>
  axios.post(`${BaseUrl()}/video-comment/${videoId}/comment`, body, {
    headers: { Authorization: `Bearer ${token()}` },
  });

const replyComment = (videoId, commentIndex, body) =>
  axios.post(`${BaseUrl()}/video-comment/${videoId}/comment/${commentIndex}/reply`, body, {
    headers: { Authorization: `Bearer ${token()}` },
  });

const hideComment = (videoId, commentIndex) =>
  axios.delete(`${BaseUrl()}/video-comment/${videoId}/comment/${commentIndex}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

const hideReply = (videoId, commentIndex, replyIndex) =>
  axios.delete(`${BaseUrl()}/video-comment/${videoId}/comment/${commentIndex}/reply/${replyIndex}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export default function CommentVideo({ open, onClose, videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyBox, setReplyBox] = useState({ commentIndex: null, text: "" });
  const [showHidden, setShowHidden] = useState(true); // Hiển thị cả comment đã ẩn

  const load = () => {
    if (!videoId) return;
    setLoading(true);
    fetchComments(videoId)
      .then(setComments)
      .catch((err) => console.error("Lỗi khi fetch comments:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) load();
  }, [open, videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Bạn chưa nhập bình luận!");
      return;
    }
    try {
      await addComment(videoId, { comment: newComment });
      setNewComment("");
      load();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err.response?.data || err);
      alert("Không thể gửi bình luận.");
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBox.text.trim()) {
      alert("Bạn chưa nhập phản hồi!");
      return;
    }
    try {
      await replyComment(videoId, replyBox.commentIndex, { comment: replyBox.text });
      setReplyBox({ commentIndex: null, text: "" });
      load();
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err.response?.data || err);
      alert("Không thể gửi phản hồi.");
    }
  };





  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="flex justify-between items-center">
        <span>Bình luận video</span>
      
      </DialogHeader>

      <DialogBody className="h-[70vh] overflow-y-auto">
        <Card shadow={false} className="p-4 bg-gray-50">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              label="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" color="blue">
              Gửi
            </Button>
          </form>
        </Card>

        {/* Danh sách */}
        {loading ? (
          <div className="flex justify-center pt-8">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <Typography className="text-center mt-6" color="gray">
            Chưa có bình luận.
          </Typography>
        ) : (
          <ul className="mt-6 space-y-3">
            {comments
              .filter(c => showHidden || c.status !== false) // Lọc theo checkbox
              .map((c, i) => {
                const isCommentDeleted = c.status === false;
                return (
                  <li
                    key={i}
                    className={`p-3 rounded shadow ${
                      isCommentDeleted ? 'bg-red-50 border border-red-200 opacity-80' : 'bg-white'
                    }`}
                  >
                    {/* Badge comment đã xóa */}
                    {isCommentDeleted && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Bình luận đã bị ẩn
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <div>
                        <Typography className={`font-medium ${isCommentDeleted ? 'text-gray-500' : ''}`}>
                          {c.userId?.fullName || "Ẩn danh"}
                          {isCommentDeleted && <span className="text-xs text-red-500 italic ml-2">(đã ẩn)</span>}
                        </Typography>
                        {/* Nội dung comment */}
                        {isCommentDeleted ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                              <em>Bình luận này đã bị ẩn bởi quản trị viên</em>
                            </div>
                            <div className="bg-white border border-orange-200 rounded p-2">
                              <span className="text-xs font-medium text-orange-600">Nội dung gốc:</span>
                              <Typography className="text-sm">{c.comment}</Typography>
                            </div>
                          </div>
                        ) : (
                          <Typography>{c.comment}</Typography>
                        )}
                      </div>
                      {/* Actions - chỉ hiển thị cho comment chưa ẩn */}
                      {!isCommentDeleted && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="text"
                            onClick={() => setReplyBox({ commentIndex: c.index, text: "" })}
                          >
                            Trả lời
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Reply box - chỉ hiển thị cho comment chưa ẩn */}
                    {!isCommentDeleted && replyBox.commentIndex === c.index && (
                      <form onSubmit={handleReply} className="flex gap-2 mt-2">
                        <Input
                          size="sm"
                          label="Phản hồi..."
                          value={replyBox.text}
                          onChange={(e) =>
                            setReplyBox((prev) => ({ ...prev, text: e.target.value }))
                          }
                          className="flex-1"
                        />
                        <Button size="sm" type="submit" color="blue">
                          Gửi
                        </Button>
                      </form>
                    )}
                    {/* Replies - hiển thị theo filter */}
                    {!isCommentDeleted && c.replies
                      ?.filter(r => showHidden || r.status !== false) // Lọc reply theo checkbox
                      ?.map((r, j) => {
                        const isReplyDeleted = r.status === false;
                        return (
                          <div
                            key={j}
                            className={`ml-4 mt-2 p-2 rounded text-sm ${
                              isReplyDeleted ? 'bg-red-100 border border-red-200' : 'bg-gray-100'
                            }`}
                          >
                            {/* Badge reply đã xóa */}
                            {isReplyDeleted && (
                              <div className="mb-1">
                                <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-red-200 text-red-800 rounded text-xs">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Đã ẩn
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>
                                <span className={`font-medium ${isReplyDeleted ? 'text-gray-500' : ''}`}>{r.userId?.fullName || "Ẩn danh"}{isReplyDeleted && <span className="text-xs text-red-500 italic ml-1">(đã ẩn)</span>}: </span>
                                {/* Nội dung reply */}
                                {isReplyDeleted ? (
                                  <span className="text-xs text-red-600 italic">Phản hồi đã bị ẩn. </span>
                                ) : null}
                                <span className="text-xs">{r.comment}</span>
                              </span>
                              {/* Reply actions - chỉ hiển thị cho reply chưa ẩn */}
                              {!isReplyDeleted && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="text"
                                    onClick={() => setReplyBox({ commentIndex: c.index, text: "" })}
                                  >
                                    Trả lời
                                  </Button>
                               
                                </div>
                              )}
                            </div>
                            {/* Nội dung gốc cho reply đã xóa */}
                            {isReplyDeleted && (
                              <div className="bg-white border border-orange-200 rounded p-1 mt-1">
                                <span className="text-xs text-orange-600">Nội dung gốc: </span>
                                <span className="text-xs">{r.comment}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </li>
                );
              })}
          </ul>
        )}
      </DialogBody>

      <DialogFooter>
        <Button color="blue" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
