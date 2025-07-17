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
  return (
  <div className="w-full max-w-4xl mx-auto p-4 min-h-screen bg-gray-50">
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
          <div className="mb-2 text-gray-700 font-semibold">
            Bài viết: <span className="font-normal">{post.title}</span>
          </div>
          
          {post.images && Array.isArray(post.images) && post.images.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Hình ảnh bài viết:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={
                      image?.startsWith('http')
                        ? image
                        : `${BaseUrl}${image}`
                    }
                    alt={`Post image ${index + 1}`}
                    className="w-full max-w-md h-auto rounded-lg shadow-sm border object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="mb-2 text-gray-700">
            Miêu tả: <span className=" break-all font-medium"> {post.description|| ""}</span>
          </div>
           {/* <div className="mb-2 text-gray-700">
            Người đăng: <span className=" break-all font-medium"> {post.authorId|| ""}</span>
          </div> */}
          <div className="mb-2 text-gray-700">
            Kiểu: <span className="font-medium"> {post.type || ""}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Thẻ: <span className="font-medium"> {post.tags || ""}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Ngày đăng: <span className="font-medium">{post.createdAt ? new Date(CommentByIdPost.createdAt).toLocaleString() : ""}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Chỉnh sửa: <span className="font-medium"> {post.updatedAt ? new Date(CommentByIdPost.updatedAt).toLocaleString() : ""}</span>
          </div>
          {CommentByIdPost.content && (
            <div className="mt-2 text-base truncate text-gray-800 border-t pt-2">
              {CommentByIdPost.content}
            </div>
          )}
        </div>
{editComment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-full mx-0 h-full overflow-y-auto">

      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Sửa bình luận</h2>
      </div>
 

      <div className="p-6">

        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <img
            src={
              editComment.userId?.avatar?.startsWith('http')
                ? editComment.userId.avatar
                : `${BaseUrl}${editComment.userId?.avatar || ''}`
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800 block">{editComment.userId?.fullName}</span>
            <span className="text-sm text-gray-500">
              {editComment.createdAt ? new Date(editComment.createdAt).toLocaleString() : ""}
            </span>
          </div>
        </div>
        
        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung bình luận:
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="4"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Nhập nội dung bình luận..."
          />
        </div>
      </div>
      
      {/* Footer */}
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
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
                        onClick={() => handleEditComment(item, index, CommentsDialog.postId)}
                      >
                        Sửa
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
                        onClick={() => handleDeleteComment(item, index, CommentsDialog.postId)}
                      >
                        Xóa
                      </button>
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
                                rep.userId?.avatar?.startsWith('http')
                                  ? rep.userId.avatar
                                  : `${BaseUrl}${rep.userId?.avatar || ''}`
                              }
                              alt="Avatar"
                              className="w-6 h-6 rounded-full border object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700">{rep.userId?.fullName}:</span>
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

 