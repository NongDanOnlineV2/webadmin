import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner'
import { Navigate, useNavigate } from 'react-router-dom'
import CommentPostbyIdPost from './CommentPostbyIdPost'
import { Dialog,Button } from '@material-tailwind/react'
export const CommentPost = () => {

  const tokenUser = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate=useNavigate()
  const [page, setPage] = useState(1)
  const [openDialogComments, setOpenDialogComments] = useState(false)
  const [CommentsDialog, setCommentsDialog] = useState(null);
  const [searchTitle, setSearchTitle] = useState('')
  const [allComments, setAllComments] = useState([]) 
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [comment,setComment]=useState([])
  const [post,setPost]=useState([])
  const [nonExistentPostIds, setNonExistentPostIds] = useState(new Set()); // Cache cho post không tồn tại
const gotoCommentId=(id)=>{
navigate(`/dashboard/CommentPostbyId/${id}`)
}

const handleOpenDialogComments=(cmtDiaolog)=>{
setCommentsDialog(cmtDiaolog)
setOpenDialogComments(true)
}

const handleCloseDialogComments=()=>{
setCommentsDialog(null)
setOpenDialogComments(false)
}

const gotoCommentByIdPost=(postId)=>{
navigate(`/dashboard/CommentPostbyIdPost/${postId}`)
}

const handleSearch = (value) => {
  setSearchTitle(value)
  setPage(1) 
}

const clearSearch = () => {
  setSearchTitle('')
  setPage(1)
}

const callApiCommentPost=async()=>{
try {

const res= await axios.get(`${BaseUrl}/admin-comment-post/?page=${page}&limit=${limit}`,{
    headers:{Authorization:`Bearer ${tokenUser}`}
})

if(res.status===200){
setComment(res.data.data)
setTotalPages(res.data.totalPages)
 setLoading(false) 
}
} catch (error) {
    // console.log("Lỗi nè",error)
    setLoading(false)
}

}
const loadAllComments = async () => {
  try {
    const allCommentsData = [];
    
    const firstRes = await axios.get(`${BaseUrl}/admin-comment-post/?page=1&limit=${limit}`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    });
    
    if (firstRes.status === 200) {
      const totalPages = firstRes.data.totalPages;
      allCommentsData.push(...firstRes.data.data);
      

      const promises = [];
      for (let i = 2; i <= totalPages; i++) {
        promises.push(
          axios.get(`${BaseUrl}/admin-comment-post/?page=${i}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${tokenUser}` }
          })
        );
      }
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res.status === 200) {
          allCommentsData.push(...res.data.data);
        }
      });
      
      setAllComments(allCommentsData);
    }
  } catch (error) {
    // console.error("Lỗi load all comments:", error);
    return false
  }
}
useEffect(()=>{
  setLoading(true)
  callApiCommentPost()
  loadAllComments() 
},[page])

useEffect(() => {
 getPost()
}, [comment, allComments]); 

const postMap = React.useMemo(() => {
  const map = {};
  post.forEach(p => {
    const key = String(p.id ?? p._id).trim();
    map[key] = p;
  });
  return map;
}, [post]);

const getPost = async () => {
  try {
    const currentPageIds = comment.map(item => item.postId);
    const allCommentsIds = allComments.map(item => item.postId);
    const uniqueIds = [...new Set([...currentPageIds, ...allCommentsIds])]; 
    
    if (uniqueIds.length === 0) return;

    // Lọc bỏ những ID đã biết không tồn tại để tránh spam API
    const validIds = uniqueIds.filter(id => 
      id && 
      String(id).trim() && 
      !nonExistentPostIds.has(String(id).trim())
    );
    
    if (validIds.length === 0) {
      setLoading(false);
      return;
    }

    const res = await axios.get(`${BaseUrl}/admin-post-feed?ids=${validIds.join(',')}`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    });

    let posts = [];
    if (res.status === 200) {
      posts = res.data.data;
      
      const foundIds = posts.map(p => String(p.id || p._id));
      const missingIds = validIds.filter(id => !foundIds.includes(String(id)));
      
      if (missingIds.length > 0) {
        const individualPromises = missingIds.map(async (postId) => {
          try {
            const individualRes = await axios.get(`${BaseUrl}/admin-post-feed/${postId}`, {
              headers: { Authorization: `Bearer ${tokenUser}` }
            });
            if (individualRes?.status === 200) {
              return individualRes.data;
            }
            return null;
          } catch (error) {
            return null;
          }
        });
        const individualResults = await Promise.all(individualPromises);
        const foundIndividualPosts = individualResults.filter(p => p !== null);
        posts = [...posts, ...foundIndividualPosts];
      }
    }

    setPost(posts);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    // console.error("Lỗi getPost:", error);
  }
};

const filteredComments = React.useMemo(() => {
  
  const dataSource = searchTitle.trim() ? allComments : comment;
  
  let result;
  if (!searchTitle.trim()) {
    result = comment; 
  } else {
    result = dataSource.filter(item => {
      const postInfo = postMap[String(item.postId).trim()];
      const title = postInfo && postInfo.title && postInfo.title.trim()
        ? postInfo.title
        : "";
      
      return title.toLowerCase().includes(searchTitle.toLowerCase());
    });
  }

  return result.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; 
  });
}, [comment, allComments, searchTitle, postMap]);

  return (
    <div>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bài viết..."
            value={searchTitle}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTitle && (
            <Button
              size="sm"
              color="gray"
              variant="outlined"
              onClick={clearSearch}
            >
              Xóa
            </Button>
          )}
        </div>
        {searchTitle && (
          <p className="text-sm text-gray-600 mt-2">
            Đang tìm kiếm: "{searchTitle}"
          </p>
        )}
      </div>

{loading?
(<div className="flex justify-center items-center w-full h-40">
     <Audio
             height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
              />
    </div>
    ):(
filteredComments.length === 0 ? (
  <div className="text-center py-8">
    <p className="text-gray-500">
      {searchTitle ? `Không tìm thấy bài viết nào với từ khóa "${searchTitle}"` : "Không có bài viết nào"}
    </p>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-1/4">
            Tiêu đề bài viết
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-1/6">
            Ngày đăng
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-1/8">
            Số bình luận
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-1/3">
            Bình luận mới nhất
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-1/8">
            Trạng thái
          </th>
        
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredComments.map((item) => {
          const postInfo = postMap[String(item.postId).trim()];
          const title = postInfo?.title?.trim();
          // Chỉ đếm comment gốc + reply 1 cấp, không cộng nhầm khi replies là mảng rỗng hoặc undefined
          const sortedComments = item.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestComment = sortedComments[0];
          const totalComments = item.comments.reduce((sum, cmt) => {
            const replyCount = Array.isArray(cmt.replies) ? cmt.replies.length : 0;
            return sum + 1 + replyCount;
          }, 0);

          return (
            <tr key={item.postId} className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenDialogComments(item)}>
              <td className="px-4 py-4 border-b max-w-xs">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 break-words line-clamp-2 overflow-hidden text-ellipsis">
                    {title}
                  </span>
                  {!postInfo && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block w-fit">
                      Bài viết đã bị xóa
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 border-b">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 border-b">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {totalComments} bình luận
                </span>
              </td>
              <td className="px-4 py-4 border-b w-1/3">
                {latestComment && (
                  <div className="text-sm max-w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={
                          latestComment.userId.avatar?.startsWith('http')
                            ? latestComment.userId.avatar
                            : `${BaseUrl}${latestComment.userId.avatar}`
                        }
                        alt=""
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                      <span className="font-medium text-gray-900 truncate">
                        {latestComment.userId.fullName}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs break-words line-clamp-2 max-w-xs overflow-hidden text-ellipsis">
                      {latestComment.comment}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(latestComment.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-sm border-b">
                {postInfo ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Đã xóa
                  </span>
                )}
              </td>
           
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)
        )
        
        }
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              Trang trước
            </Button>
            <span>Trang {page} / {totalPages}</span>
            <Button
              size="sm"
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
            >
              Trang sau
            </Button>
          </div>
                 { openDialogComments&&(
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
    </div>
  )
}

export default CommentPost