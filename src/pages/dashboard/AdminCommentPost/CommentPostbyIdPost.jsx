import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BaseUrl } from '@/ipconfig'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Audio } from 'react-loader-spinner'
import { Typography } from '@material-tailwind/react'
export const CommentPostbyIdPost = ({CommentsDialog}) => {

    const [CommentByIdPost,setCommentByIdPost]=useState([])
    const [loading, setLoading] = useState(true)
    const tokenUser = localStorage.getItem('token');
    const [editComment, setEditComment] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editCommentIndex, setEditCommentIndex] = useState(null);
    const [userComment, setUserComment] = useState(null);
    const [IdUser, setIdUser] = useState(null);
    const [post, setPost] = useState("");
    const [users, setUsers] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const limit = 10;
    const [page, setPage] = useState(1)

    const getCommentById=async(postId)=>{
try {
    const res= await axios.get(`${BaseUrl}/admin-comment-post/post/${postId}`,
        {headers:{Authorization:`Bearer ${tokenUser}` }})
    
  if(res.status===200){
   setCommentByIdPost(res.data)
  }

} catch (error) {
    setLoading(false)
}
    }

   const getUsertByComment=async()=>{
try {
    const res= await axios.get(`${BaseUrl}/admin-users/${IdUser}`,
        {headers:{Authorization:`Bearer ${tokenUser}` }})
  if(res.status===200){
   setUserComment(res.data)

  }

} catch (error) {
    setLoading(false)
}
    }

const handleEditComment = (comment, index, postId) => {
  setEditComment({ ...comment, postId });
  setEditContent(comment.comment);
  setEditCommentIndex(index);
};
const callPost=async(postId)=>{
try {

 const res = await axios.get(`${BaseUrl}/admin-post-feed/${postId}`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    });

if(res.status===200){
setPost(res.data)
setIdUser(res.data.authorId)
 setLoading(false) 
}
} catch (error) {
    setLoading(false)
}

}

const getAllUsers = async () => {
    try {
      let allUsers = []
      let currentPage = 1
      while (true) {
        const res = await axios.get(`${BaseUrl}/admin-users?page=${currentPage}&limit=50`, {
          headers: { Authorization: `Bearer ${tokenUser}` },
        })
        if (res.status === 200 && res.data.data.length > 0) {
          allUsers = [...allUsers, ...res.data.data]
          currentPage++
        } else {
          break
        }
      }
      setUsers(allUsers)
    } catch (error) {
      // Error handling
    }
  }


useEffect(() => {
  getAllUsers();
}, []);

  // Helper functions
  const getCommentsCount = () => {
    // New structure: {data: Array} where data contains comments directly
    if (CommentByIdPost && CommentByIdPost.data && Array.isArray(CommentByIdPost.data)) {
      return CommentByIdPost.data.length;
    }
    
    // Fallback: Check if comments are nested
    if (CommentByIdPost && CommentByIdPost.data && Array.isArray(CommentByIdPost.data) && CommentByIdPost.data.length > 0) {
      return CommentByIdPost.data[0].comments?.length || 0;
    }
    
    if (CommentByIdPost && CommentByIdPost.comments && Array.isArray(CommentByIdPost.comments)) {
      return CommentByIdPost.comments.length;
    }
    
    return 0;
  };

  const getCommentsData = () => {
    // New structure: {data: Array} where data contains comments directly
    if (CommentByIdPost && CommentByIdPost.data && Array.isArray(CommentByIdPost.data)) {
      return CommentByIdPost.data;
    }
    
    // Fallback: Check if comments are nested
    if (CommentByIdPost && CommentByIdPost.data && Array.isArray(CommentByIdPost.data) && CommentByIdPost.data.length > 0) {
      return CommentByIdPost.data[0].comments || [];
    }
    
    if (CommentByIdPost && CommentByIdPost.comments && Array.isArray(CommentByIdPost.comments)) {
      return CommentByIdPost.comments;
    }
    
    return [];
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : '';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `${BaseUrl}${imagePath}`;
  };

  const renderCommentActions = (item, index) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuIndex(openMenuIndex === index ? null : index);
        }}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 border border-gray-200"
        title="Tùy chọn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      
      {openMenuIndex === index && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Thao tác với bình luận</p>
            </div>
            
            <button
              onClick={() => {
                handleEditComment(item, index, CommentsDialog.postId);
                setOpenMenuIndex(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Chỉnh sửa bình luận</div>
                <div className="text-xs text-gray-500">Sửa nội dung bình luận này</div>
              </div>
              <div className="text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <hr className="border-gray-100 my-1" />
            
            <button
              onClick={() => {
                if(confirm('�️‍🗨️ Bạn có chắc chắn muốn ẩn bình luận này không?\n\n"' + item.comment + '"\n\nBình luận sẽ được ẩn khỏi người dùng (status = false).')) {
                  handleDeleteComment(item, index, CommentsDialog.postId);
                }
                setOpenMenuIndex(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Ẩn bình luận</div>
                <div className="text-xs text-gray-500">Ẩn bình luận khỏi người dùng</div>
              </div>
              <div className="text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderReplies = (replies) => (
    <div className="ml-12 mt-4 border-l-2 border-blue-100 pl-4 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg py-3">
      <div className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Phản hồi ({replies.length})
      </div>
      <div className="space-y-3">
        {replies.map((reply, repIndex) => (
          <div key={reply._id || repIndex} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100">
            <img
              src={getImageUrl(getAvatarById(reply.userId))}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 text-sm">{getFullNameById(reply.userId)}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed break-words">{reply.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComments = () => {
    const comments = getCommentsData();
    
    if (comments.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Chưa có bình luận nào</h3>
          <p className="text-gray-600 text-lg">Hãy là người đầu tiên bình luận về bài viết này!</p>
        </div>
      );
    }

   
    const sortedComments = [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; 
    });

    return (
      <div className="space-y-6">
        {sortedComments.map((comment, index) => {
         
          const originalIndex = comments.findIndex(c => c._id === comment._id);
          
          return (
            <div key={comment._id || index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={getImageUrl(comment.userId?.avatar)}
                      alt={comment.userId?.fullName || 'User'}
                      className="w-14 h-14 rounded-full border-3 border-gray-200 object-cover shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">{comment.userId?.fullName || 'Người dùng'}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {comment.status ? 'Đang hoạt động' : 'Đã ẩn'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                {/* Always visible 3-dot menu */}
                <div className="flex-shrink-0">
                  {renderCommentActions(comment, originalIndex)}
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed break-words text-lg">{comment.comment}</p>
                </div>
              </div>

              {/* Comment Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">{comment.replies?.length || 0} phản hồi</span>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 pl-6 border-l-2 border-gradient-to-b from-blue-200 to-indigo-200">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        {comment.replies.length} phản hồi
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[...comment.replies].sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return dateB - dateA; 
                    }).map((reply, repIndex) => (
                      <div key={reply._id || repIndex} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <img
                            src={getImageUrl(getAvatarById(reply.userId))}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-blue-200 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{getFullNameById(reply.userId)}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-800 leading-relaxed break-words">{reply.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getFullNameById = (id) => {
  const user = users.find(u => u.id === id || u._id === id);
  return user?.fullName || "Không xác định";
};

const getAvatarById = (id) => {
  const user = users.find(u => u.id === id || u._id === id);
  return user?.avatar || '';
};


const handleUpdateComment = async (postId) => {
  try {
    
    const res = await axios.put(
      `${BaseUrl}/admin-comment-post/${postId}/comment/${editCommentIndex}`,
      { comment: editContent.trim() },
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    );
    
    if (res.status === 200) {
      // Reset form
      setEditComment(null);
      setEditCommentIndex(null);
      setEditContent('');
      
      // Refresh data
      await getCommentById(postId);
      
      // Show success message
      alert("✅ Cập nhật bình luận thành công!");
    }
  } catch (error) {
    alert("❌ Lỗi khi cập nhật bình luận: " + (error.response?.data?.message || error.message));
  }
};

const handleDeleteComment = async (comment, index, postId) => {
  try {
    // Thay đổi status thành false thay vì xóa hoàn toàn
    const res = await axios.put(
      `${BaseUrl}/admin-comment-post/${postId}/comment/${index}`,
      { status: false },
      {
        headers: { Authorization: `Bearer ${tokenUser}` },
      }
    );
    
    if (res.status === 200) {
      await getCommentById(postId);
      alert("✅ Ẩn bình luận thành công!");
    }
  } catch (error) {
    alert("❌ Lỗi khi ẩn bình luận: " + (error.response?.data?.message || error.message));
  }
};


    useEffect(()=>{
if(CommentsDialog?.postId) {
  getCommentById(CommentsDialog.postId)
  callPost(CommentsDialog.postId)
}
getUsertByComment()
    setLoading(false)

    },[])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (openMenuIndex !== null) {
          setOpenMenuIndex(null);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuIndex]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <Typography variant="h3" className="font-bold text-gray-900 leading-tight">
                Quản lý Bình luận
              </Typography>
              <p className="text-gray-600 mt-1">
                Xem và quản lý tất cả bình luận của bài viết
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <Audio
                height="80"
                width="80"
                radius="9"
                color="#3B82F6"
                ariaLabel="loading"
              />
              <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
        {/* Post Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết bài viết</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Column */}
            <div className="order-2 lg:order-1">
              {post.images && Array.isArray(post.images) && post.images.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      Hình ảnh ({post.images.length})
                    </span>
                  </div>
                  <div className={`gap-3 ${
                    post.images.length === 1 ? 'grid grid-cols-1' :
                    post.images.length === 2 ? 'grid grid-cols-2' :
                    post.images.length === 3 ? 'grid grid-cols-2' :
                    post.images.length === 4 ? 'grid grid-cols-2' :
                    'grid grid-cols-3'
                  }`}>
                    {post.images.slice(0, showAllImages ? post.images.length : Math.min(4, post.images.length)).map((image, index) => (
                      <div 
                        key={index}
                        className={`
                          ${post.images.length === 3 && index === 0 ? 'col-span-2' : ''}
                          ${!showAllImages && post.images.length > 4 && index === 3 ? 'relative' : ''}
                          relative group overflow-hidden rounded-xl
                        `}
                      >
                        <img 
                          src={getImageUrl(image)}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onClick={() => {
                            window.open(getImageUrl(image), '_blank');
                          }}
                        />
                        {!showAllImages && post.images.length > 4 && index === 3 && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-opacity-70 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllImages(true);
                            }}
                          >
                            <div className="text-center">
                              <div className="text-2xl font-bold">+{post.images.length - 4}</div>
                              <div className="text-sm">ảnh khác</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {showAllImages && post.images.length > 4 && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => setShowAllImages(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Thu gọn ảnh
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium">Không có hình ảnh</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {post.title || "Tiêu đề bài viết"}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600 block mb-2">Mô tả:</span> 
                    <p className="text-gray-800 leading-relaxed">{post.description || "Không có mô tả"}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-600">Loại:</span> 
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {post.type || "Không xác định"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-600">Thẻ:</span> 
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {post.tags || "Không có thẻ"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-600">Ngày đăng:</span> 
                        <div className="text-sm text-gray-800">{formatDate(post.createdAt) || "Không xác định"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-600">Chỉnh sửa:</span> 
                        <div className="text-sm text-gray-800">{formatDate(post.updatedAt) || "Chưa chỉnh sửa"}</div>
                      </div>
                    </div>
                  </div>
                  
                  {post.content && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-600 block mb-3">Nội dung bài viết:</span>
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-800 leading-relaxed max-h-40 overflow-y-auto">
                        {post.content}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Edit Comment Modal */}
        {editComment && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden transform transition-all">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa bình luận</h2>
                  </div>
                  <button
                    onClick={() => setEditComment(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nội dung bình luận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                      rows="6"
                      placeholder="Nhập nội dung bình luận của bạn..."
                      maxLength={500}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {editContent.length}/500
                    </div>
                  </div>
                  {editContent.trim() === '' && (
                    <p className="text-sm text-red-500 mt-2">Nội dung bình luận không được để trống</p>
                  )}
                </div>

               
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
                <button
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setEditComment(null)}
                >
                  Hủy bỏ
                </button>
                <button
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!editContent.trim()}
                  onClick={() => handleUpdateComment(CommentsDialog.postId)}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Bình luận ({getCommentsCount()})
            </h3>
            <div className="text-sm text-gray-500">
              Sắp xếp theo thời gian mới nhất
            </div>
          </div>
          
          {renderComments()}
        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPostbyIdPost

 