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
    console.log("Lỗi nè",error)
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
    console.log("Lỗi nè",error)
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
    console.log("Lỗi nè",error)
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


// console.log("data nè",CommentByIdPost.comments.length)
console.log(post)
    useEffect(()=>{
getCommentById(CommentsDialog.postId)
callPost(CommentsDialog.postId)
getUsertByComment()
    setLoading(false)

    },[])
  return (
  <div className="max-w-2xl mx-auto p-4">
     <Typography variant="h5" color="blue-gray" className="font-semibold mb-4">
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 className="font-bold mb-2">Sửa bình luận</h2>
      <div className="flex items-center gap-3 mb-2">
        <img
          src={
            editComment.userId?.avatar?.startsWith('http')
              ? editComment.userId.avatar
              : `${BaseUrl}${editComment.userId?.avatar || ''}`
          }
          alt=""
          className="w-8 h-8 rounded-full border"
        />
        <span className="font-semibold text-gray-800">{editComment.userId?.fullName}</span>
        <span className="text-xs text-gray-500 ml-2">
          {editComment.createdAt ? new Date(editComment.createdAt).toLocaleString() : ""}
        </span>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-4"
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setEditComment(null)}
        >
          Hủy
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => handleUpdateComment(CommentsDialog.postId)}
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
)}
        {CommentByIdPost && Array.isArray(CommentByIdPost.comments) && CommentByIdPost.comments.length > 0 ? (
          CommentByIdPost.comments.map((item,index) =>  {
            return(
<div
              key={index}
              className="border rounded-lg bg-gray-50 p-4 mb-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    item.userId.avatar?.startsWith('http')
                      ? item.userId.avatar
                      : `${BaseUrl}${item.userId.avatar}`
                  }
                  alt=""
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-semibold text-gray-800">{item.userId?.fullName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                </span>
              </div>
     <div className="ml-auto flex gap-2">
      <button
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs shadow transition"
        onClick={() => handleEditComment(item, index, CommentsDialog.postId)}
      >
        Sửa
      </button>
      <button
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs shadow transition"
        onClick={() => handleDeleteComment(item, index, CommentsDialog.postId)}
      >
        Xóa
      </button>
    </div>
              <div className="ml-11 break-all text-gray-700 mb-2">{item.comment}</div>
              
              {item.replies && item.replies.length > 0 && (
                <div className="ml-11 mt-2 border-l-2 border-blue-200 pl-4">
                  {item.replies.map((rep) => (
                    <div
                      key={rep._id}
                      className="flex items-start gap-2 text-sm text-gray-700 mb-2"
                    >
                      <img
                        alt=""
                        className="w-5 h-5 rounded-full"
                        src={
                          getAvatarById(rep.userId)?.startsWith('http')
                            ? getAvatarById(rep.userId)
                            : `${BaseUrl}${getAvatarById(rep.userId)}`
                        }
                      />
                      <div>
                        <span className="font-semibold text-gray-700">{getFullNameById(rep.userId)}:</span>
                        <span className="ml-1 break-all" >{rep.comment}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          {rep.createdAt ? new Date(rep.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            )
})
        ) : (
          <div className="text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>

      
    )}
         
  </div>
)
  
}

export default CommentPostbyIdPost

 