import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '@/ipconfig';
import { Audio } from 'react-loader-spinner';

export const DialogCommentsByid = ({ postInfo, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem('token');
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : '';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/40x40.png?text=👤";
    return imagePath.startsWith('http') ? imagePath : `${BaseUrl()}${imagePath}`;
  };

  // Lấy tất cả comments của bài viết
  const fetchAllComments = async () => {
    if (!postInfo?.postId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl()}/admin-comment-post/post/${postInfo.postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 200) {
        const allComments = res.data.data || res.data.comments || [];
        setComments(allComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, [postInfo?.postId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tất cả bình luận</h2>
                <p className="text-sm text-gray-600">Xem toàn bộ bình luận của bài viết</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Audio height="60" width="60" radius="9" color="#3B82F6" ariaLabel="loading" />
            </div>
          ) : (
            <div className="p-6">
              {/* Post Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Tổng: {comments.length} bình luận
                  </span>
                  <span className="text-green-600">
                    Hoạt động: {comments.filter(c => c.status !== false).length}
                  </span>
                  <span className="text-red-600">
                    Đã xóa: {comments.filter(c => c.status === false).length}
                  </span>
                </div>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bình luận</h3>
                  <p className="text-gray-500">Bài viết này chưa có bình luận nào</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((comment, index) => {
                      const isDeleted = comment.status === false;
                      
                      return (
                    <div 
                      key={index} 
                      className={`border rounded-xl p-6 shadow-sm transition-shadow ${
                        isDeleted 
                          ? 'bg-red-50 border-red-200 opacity-80' 
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      {/* Badge đã xóa */}
                      {isDeleted && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Bình luận đã bị xóa
                          </div>
                        </div>
                      )}

                      {/* Main Comment */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={getImageUrl(comment?.userId?.avatar)}
                            alt={comment?.userId?.fullName || 'User'}
                            className={`w-12 h-12 rounded-full border-2 object-cover ${
                              isDeleted ? 'border-red-300 grayscale' : 'border-gray-200'
                            }`}
                          />
                          {isDeleted && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 
                              className={`font-bold transition-colors ${
                                isDeleted 
                                  ? 'text-gray-500' 
                                  : 'text-gray-900 hover:text-blue-600 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isDeleted) {
                                  const userId = comment?.userId?._id || comment?.userId?.id;
                                  if (userId) {
                                    navigate(`/dashboard/users/${userId}`);
                                  }
                                }
                              }}
                              title={isDeleted ? "Bình luận đã bị xóa" : "Xem chi tiết người dùng"}
                            >
                              {comment?.userId?.fullName || 'Người dùng'}
                            </h3>
                            <span className={`text-xs ${isDeleted ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(comment?.createdAt)}
                            </span>
                          </div>
                          
                          {/* Nội dung comment */}
                          <div className={`rounded-lg p-3 border-l-4 ${
                            isDeleted 
                              ? 'bg-red-50 border-red-400' 
                              : 'bg-gray-50 border-blue-500'
                          }`}>
                            {isDeleted ? (
                              <div className="space-y-3">
   
                                <div className="bg-white border border-orange-200 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-xs font-medium text-orange-600">Nội dung gốc:</span>
                                  </div>
                                  <p className="text-gray-800 text-sm leading-relaxed break-words">
                                    {comment?.comment}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-800 leading-relaxed break-words">
                                {comment?.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Replies - chỉ hiển thị cho comment chưa xóa */}
                      {!isDeleted && comment?.replies && comment.replies.length > 0 && (
                        <div className="ml-8 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm font-semibold text-gray-600 mb-3">
                            {comment.replies.length} phản hồi
                          </p>
                          <div className="space-y-3">
                            {comment.replies
                              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                              .map((reply, replyIndex) => (
                              <div key={replyIndex} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={getImageUrl(reply.avatar)}
                                    alt={reply.userId?.fullName || 'User'}
                                    className="w-8 h-8 rounded-full border border-blue-300 object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span 
                                        className="font-semibold text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
                                        onClick={() => {
                                          const userId = reply.userId?._id || reply.userId?.id;
                                          if (userId) {
                                            navigate(`/dashboard/users/${userId}`);
                                          }
                                        }}
                                        title="Xem chi tiết người dùng"
                                      >
                                        {reply.fullName || 'Người dùng'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-sm break-words">{reply.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default DialogCommentsByid;