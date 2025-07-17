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
    // console.log("Lỗi nè",error)
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
    // console.log("Lỗi nè",error)
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
    // console.log("Lỗi nè",error)
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
      console.error("Lỗi khi lấy danh sách user:", error)
    }
  }


useEffect(() => {
  getAllUsers();
}, []);

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
      { comment: editContent },
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    );
    if (res.status === 200) {
      setEditComment(null);
      setEditCommentIndex(null);
      getCommentById(postId);
      alert("Cập nhật thành công")
    }
  } catch (error) {
    alert("Lỗi khi cập nhật bình luận");
    setLoading(false);
  }
};

const handleDeleteComment = async (comment, index, postId) => {
  try {
    const res = await axios.delete(
      `${BaseUrl}/admin-comment-post/${postId}/comment/${index}`,
      {
        data: { status: false },
        headers: { Authorization: `Bearer ${tokenUser}` },
      }
    );
    if (res.status === 200) {
      getCommentById(postId);
      alert("Xóa thành công");
    }
  } catch (error) {
    alert("Lỗi khi xóa bình luận");
    setLoading(false);
  }
};


    useEffect(()=>{
getCommentById(CommentsDialog.postId)
callPost(CommentsDialog.postId)
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
  <div className="   p-4 bg-gray-50">
     <Typography variant="h5" color="blue-gray" className="font-semibold mb-6">
            Quản lý Bình luận
          </Typography>
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
        />
      </div>
    ) : (
      <div>
        <div className="border bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cột hình ảnh bên trái */}
            <div className="flex-shrink-0 lg:w-2/5 w-full">
              {post.images && Array.isArray(post.images) && post.images.length > 0 ? (
                <div>
                  <div className="text-sm text-gray-600 mb-3 font-semibold">Hình ảnh bài viết ({post.images.length}):</div>
                  <div className={`gap-2 ${
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
                          relative group
                        `}
                      >
                        <img 
                          src={
                            image?.startsWith('http')
                              ? image
                              : `${BaseUrl}${image}`
                          }
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 max-h-80 object-cover rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onClick={() => {
                            window.open(image?.startsWith('http') ? image : `${BaseUrl}${image}`, '_blank');
                          }}
                        />
                        {!showAllImages && post.images.length > 4 && index === 3 && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-opacity-70 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllImages(true);
                            }}
                          >
                            <div className="text-center">
                              <div className="text-lg">+{post.images.length - 4}</div>
                              <div className="text-xs">ảnh khác</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {showAllImages && post.images.length > 4 && (
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => setShowAllImages(false)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Thu gọn ảnh
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Không có hình ảnh
                  </div>
                </div>
              )}
            </div>

            {/* Cột nội dung bên phải */}
            <div className="flex-1 lg:w-3/5 w-full min-w-0">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 break-words">{post.title || "Tiêu đề bài viết"}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-600">Miêu tả:</span> 
                  <p className="mt-1 text-gray-800 leading-relaxed break-words">{post.description || "Không có miêu tả"}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Kiểu:</span> 
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap">
                      {post.type || "Không xác định"}
                    </span>
                  </div>
                  
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Thẻ:</span> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs whitespace-nowrap">
                      {post.tags || "Không có thẻ"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Ngày đăng:</span> 
                    <div className="mt-1 break-words">{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Không xác định"}</div>
                  </div>
                  
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Chỉnh sửa:</span> 
                    <div className="mt-1 break-words">{post.updatedAt ? new Date(post.updatedAt).toLocaleString() : "Chưa chỉnh sửa"}</div>
                  </div>
                </div>
                
                {post.content && (
                  <div className="pt-3 border-t">
                    <span className="font-semibold text-gray-600 block mb-2">Nội dung bài viết:</span>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-800 leading-relaxed max-h-32 overflow-y-auto break-words">
                      {post.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
{editComment && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Sửa bình luận</h2>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung bình luận:
          </label>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="6"
            placeholder="Nhập nội dung bình luận..."
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          onClick={() => setEditComment(null)}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          onClick={() => handleUpdateComment(CommentsDialog.postId)}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  </div>
)}

        {CommentByIdPost && Array.isArray(CommentByIdPost.comments) && CommentByIdPost.comments.length > 0 ? (
          <div className="space-y-4">
            {CommentByIdPost.comments.map((item,index) =>  {
              return(
                <div
                  key={index}
                  className="border rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={
                          item.userId.avatar?.startsWith('http')
                            ? item.userId.avatar
                            : `${BaseUrl}${item.userId.avatar}`
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 block">{item.userId?.fullName}</span>
                        <span className="text-xs text-gray-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </div>
                    
                    {/* Menu 3 chấm */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {openMenuIndex === index && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => {
                              handleEditComment(item, index, CommentsDialog.postId);
                              setOpenMenuIndex(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors first:rounded-t-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa bình luận
                          </button>
                          <hr className="border-gray-100" />
                          <button
                            onClick={() => {
                              if(confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                                handleDeleteComment(item, index, CommentsDialog.postId);
                              }
                              setOpenMenuIndex(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa bình luận
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-13 text-gray-700 mb-3 leading-relaxed break-words">
                    {item.comment}
                  </div>
                  
                  {item.replies && item.replies.length > 0 && (
                    <div className="ml-13 mt-3 border-l-3 border-blue-200 pl-4 bg-gray-50 rounded-r-lg p-3">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        Phản hồi ({item.replies.length}):
                      </div>
                      <div className="space-y-2">
                        {item.replies.map((rep) => (
                          <div
                            key={rep._id}
                            className="flex items-start gap-2 bg-white p-2 rounded-lg"
                          >
                            <img
                              src={
                                getAvatarById(rep.userId)?.startsWith('http')
                                  ? getAvatarById(rep.userId)
                                  : `${BaseUrl}${getAvatarById(rep.userId) || ''}`
                              }
                              alt="Avatar"
                              className="w-6 h-6 rounded-full border object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700">{getFullNameById(rep.userId)}:</span>
                                <span className="ml-2 text-gray-600 break-words">{rep.comment}</span>
                              </div>
                              <span className="text-xs text-gray-400 mt-1 block">
                                {rep.createdAt ? new Date(rep.createdAt).toLocaleString() : ""}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>

      
    )}
         
  </div>
)
  
}

export default CommentPostbyIdPost

 