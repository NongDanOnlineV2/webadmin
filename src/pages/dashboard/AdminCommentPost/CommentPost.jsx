import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Audio } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import CommentPostbyIdPost from './CommentPostbyIdPost'
import { Dialog, Button } from '@material-tailwind/react'
import DialogCommentsByid from './DialogCommentsByid'
export const CommentPost = () => {
  const tokenUser = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [openDialogComments, setOpenDialogComments] = useState(false)
  const [CommentsDialog, setCommentsDialog] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [comment, setComment] = useState([])
  const [pageCache, setPageCache] = useState(new Map());
  const [openCommentDetailDialog, setOpenCommentDetailDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const handleOpenDialogComments = (cmtDialog) => {
    setCommentsDialog(cmtDialog)
    setOpenDialogComments(true)
  }
  const handleCloseDialogComments = () => {
    setCommentsDialog(null)
    setOpenDialogComments(false)
  }

  const handleOpenCommentDetail = (comment, postInfo) => {
    setSelectedComment(postInfo); 
    setOpenCommentDetailDialog(true);
  };

  const handleCloseCommentDetail = () => {
    setSelectedComment(null);
    setOpenCommentDetailDialog(false);
  };

  const callApiCommentPost = async () => {
    try {
      const cacheKey = `page-${page}`;
      if (pageCache.has(cacheKey)) {
        const cachedData = pageCache.get(cacheKey);
        setComment(cachedData.data);
        setTotalPages(cachedData.totalPages);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BaseUrl}/admin-comment-post/?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });

      if (res.status === 200) {
        const newCache = new Map(pageCache);
        newCache.set(cacheKey, {
          data: res.data.data,
          totalPages: res.data.totalPages,
          timestamp: Date.now()
        });
        setPageCache(newCache);
        
        setComment(res.data.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true)
    callApiCommentPost()
  }, [page]) // Thêm dependency page để chuyển trang
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý bình luận bài viết</h1>
          <p className="text-gray-600">Xem và quản lý tất cả bình luận trên các bài viết</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full h-64 bg-white rounded-lg shadow-sm">
            <Audio
              height="80"
              width="80"
              radius="9"
              color="#3B82F6"
              ariaLabel="loading"
            />
          </div>
        ) : (
          comment.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h10a2 2 0 002-2V8M9 12h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bình luận nào</h3>
              <p className="text-gray-500">Các bình luận sẽ hiển thị tại đây khi có</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                        Bình luận mới nhất
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Số bình luận
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Ngày đăng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comment
                      .sort((a, b) => {
                  
                        const getLatestCommentTime = (item) => {
                          if (!item.comments || item.comments.length === 0) return new Date(0);
                          const latestComment = item.comments.reduce((latest, current) => {
                            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
                          });
                          return new Date(latestComment.createdAt);
                        };
                        
                        const timeA = getLatestCommentTime(a);
                        const timeB = getLatestCommentTime(b);
                        return timeB - timeA; 
                      })
                      .map((item) => {
                      const sortedComments = item.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                      const latestComment = sortedComments[0];
                      const totalComments = item.comments.reduce((sum, cmt) => {
                        const replyCount = Array.isArray(cmt.replies) ? cmt.replies.length : 0;
                        return sum + 1 + replyCount;
                      }, 0);
                      return (
                        <tr key={item.postId} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            {latestComment ? (
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <img

                                    src={
                                      latestComment.userId.avatar?.startsWith('http')
                                        ? latestComment.userId.avatar
                                        : `${BaseUrl}${latestComment.userId.avatar}`
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="cursor-pointer text-sm font-medium text-gray-900 truncate"
                                    onClick={() => navigate(`/dashboard/users/${latestComment.userId?._id}`)}
                                    >
                                      {latestComment.userId.fullName}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      Mới nhất
                                    </span>
                                  </div>
                                  <p 
                                    className="text-sm break-all text-gray-600 line-clamp-2 mb-2 transition-colors"
                                   
                                  >
                                    {latestComment.comment}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(latestComment.createdAt).toLocaleString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 italic">Không có bình luận</div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3 cursor-pointer hover:text-blue-600">
                                <svg  onClick={() => handleOpenCommentDetail(latestComment, item)}
                                    title="Nhấn để xem chi tiết comment" className="  w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">{totalComments}</p>
                                <p className="text-xs text-gray-500">bình luận</p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {latestComment ? new Date(latestComment.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : "Chưa có bình luận"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleOpenDialogComments(item)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm mt-6 px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-1">
              {/* Previous button */}
              <button
                onClick={() => setPage(prev => prev - 1)}
                disabled={page <= 1}
                className={`px-3 py-2 text-sm border rounded ${
                  page <= 1 
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                «
              </button>

              {(() => {
                const pages = [];
                
                if (totalPages <= 3) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);
                  
                  if (page > 3) {
                    pages.push('...');
                  }
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  
                  for (let i = start; i <= end; i++) {
                    if (!pages.includes(i)) {
                      pages.push(i);
                    }
                  }
                  
                  if (page < totalPages - 2) {
                    pages.push('...');
                  }
                  
                  // Luôn hiển thị trang cuối
                  if (!pages.includes(totalPages)) {
                    pages.push(totalPages);
                  }
                }
                
                return pages.map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm border rounded transition-colors ${
                        pageNum === page
                          ? 'bg-black text-white border-black'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              {/* Next button */}
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages}
                className={`px-3 py-2 text-sm border rounded ${
                  page >= totalPages 
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {openDialogComments && (
        <Dialog open={openDialogComments} handler={handleCloseDialogComments} size="xl">
          <div className="max-h-[80vh] overflow-y-auto">
            <CommentPostbyIdPost
              openDialog={openDialogComments}
              handleCloseDialog={handleCloseDialogComments}
              CommentsDialog={CommentsDialog}
            />
          </div>
        </Dialog>
      )}

      {openCommentDetailDialog && selectedComment && (
        <DialogCommentsByid
          postInfo={{
            postId: selectedComment.postId,
          }}
          onClose={handleCloseCommentDetail}
        />
      )}
    </div>
  )
}

export default CommentPost