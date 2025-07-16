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
console.log("comment dialog nè:",CommentsDialog)
  const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
const [comment,setComment]=useState([])
const [post,setPost]=useState([])
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
    console.log("Lỗi nè",error)
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
    console.error("Lỗi load all comments:", error);
  }
}
// console.log(comment)

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

    console.log('Requesting posts for IDs:', uniqueIds);

    const res = await axios.get(`${BaseUrl}/admin-post-feed?ids=${uniqueIds.join(',')}`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    });

    let posts = [];
    if (res.status === 200) {
      posts = res.data.data;
      
      const foundIds = posts.map(p => String(p.id || p._id));
      const missingIds = uniqueIds.filter(id => !foundIds.includes(String(id)));
      console.log('Missing post IDs:', missingIds);
      
      if (missingIds.length > 0) {
        console.log('Attempting to fetch missing posts individually...');
        const individualPromises = missingIds.map(async (postId) => {
          try {
            let individualRes;
            
            try {
              individualRes = await axios.get(`${BaseUrl}/admin-post-feed/${postId}`, {
                headers: { Authorization: `Bearer ${tokenUser}` }
              });
            } catch (e1) {
              try {
                individualRes = await axios.get(`${BaseUrl}/admin-post/${postId}`, {
                  headers: { Authorization: `Bearer ${tokenUser}` }
                });
              } catch (e2) {
                individualRes = await axios.get(`${BaseUrl}/post/${postId}`, {
                  headers: { Authorization: `Bearer ${tokenUser}` }
                });
              }
            }
            
            if (individualRes.status === 200) {
              console.log('Found individual post:', postId, individualRes.data);
              return individualRes.data;
            }
          } catch (error) {
            console.log('Individual post not found:', postId, error.response?.status);
            return null;
          }
        });
        
        const individualResults = await Promise.all(individualPromises);
        const foundIndividualPosts = individualResults.filter(p => p !== null);
        posts = [...posts, ...foundIndividualPosts];
        console.log('Total posts after individual fetch:', posts.length);
      }
    }

    setPost(posts);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Lỗi getPost:", error);
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
(<div>
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
filteredComments.map((item) => {
 const postInfo = postMap[String(item.postId).trim()];
 
 const title = postInfo?.title?.trim() 
   ? postInfo.title
   : `Bài viết không tìm thấy (ID: ${String(item.postId).slice(-8)})`;
   
  return (
    <div onClick={() => handleOpenDialogComments(item)} key={item.postId} className="mb-4 p-4 border rounded bg-white">
      <div className="cursor-pointer font-bold mb-2 w-full flex flex-col">
        <div className="flex items-center gap-2">
          <span>Tiêu đề bài viết: {title}</span>
          {!postInfo && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Bài viết đã bị xóa
            </span>
          )}
        </div>

        <span>
          Ngày đăng: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Chưa cập nhật"}
        </span>
        {item.comments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          .map((cmt, index) => (
          <div key={index} className="mb-2 pl-2 border-l">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={
                    cmt.userId.avatar?.startsWith('http')
                      ? cmt.userId.avatar
                      : `${BaseUrl}${cmt.userId.avatar}`
                  }
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium truncate">{cmt.userId.fullName}</span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap text-right block min-w-[90px]">{new Date(cmt.createdAt).toLocaleString()}</span>
            </div>
            <div className="ml-8 text-sm mt-1 overflow-hidden">
              <div className="break-all">{cmt.comment}</div>
            </div>
            {cmt.replies && cmt.replies.length > 0 && (
              <div className="ml-12 mt-1">
                {cmt.replies
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                  .map((rep, ridx) => (
                  <div key={ridx} className="mb-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2 justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img alt="" className="w-5 h-5 rounded-full" />
                        <span className="font-medium truncate">{rep.userId.fullName}</span>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap text-right block min-w-[90px]">{new Date(rep.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="ml-7 text-sm mt-1 max-w-full overflow-hidden">
                      <div className="break-all">{rep.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})
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