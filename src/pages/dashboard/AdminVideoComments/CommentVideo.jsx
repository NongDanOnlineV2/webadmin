import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { Audio } from 'react-loader-spinner'
import DialogCommentVideo from './DialogCommentVideo'

export const CommentVideo = () => {
  const token = localStorage.getItem('token');
  const [commentVideo, setCommentVideo] = useState([]); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearchMode, setIsSearchMode] = useState(false); 


  const cacheRef = useRef({});

  const handleOpenDialog = (comment) => {
    setSelectedComment(comment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComment(null);
  };


  const getCommentsVideo = async (pageValue = 1) => {
    const cacheKey = `page_${pageValue}`;
    

    if (cacheRef.current[cacheKey]) {
      const cachedData = cacheRef.current[cacheKey];
      setCommentVideo(cachedData.data);
      setTotalPages(cachedData.totalPages);
      setPage(pageValue);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl()}/video-comment/admin/comments?page=${pageValue}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        const data = res.data.data || [];
        const totalPagesFromAPI = res.data.totalPages || 1;
        
        setCommentVideo(data);
        setTotalPages(totalPagesFromAPI);
        setPage(pageValue);

        cacheRef.current[cacheKey] = {
          data: data,
          totalPages: totalPagesFromAPI
        };
      }
    } catch (error) {
      console.log(error);
      setCommentVideo([]);
    } finally {
      setLoading(false);
    }
  };

  const searchAllComments = async (searchValue, pageValue = 1) => {
    if (!searchValue.trim()) {
      setIsSearchMode(false);
      getCommentsVideo(pageValue);
      return;
    }

    setLoading(true);
    setIsSearchMode(true);
    
    try {

      const res = await axios.get(`${BaseUrl()}/video-comment/admin/comments?page=1&limit=1000&search=${encodeURIComponent(searchValue.trim())}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 200) {
        const allSearchData = res.data.data || [];
        

        const filtered = allSearchData.filter(item => 
          item.user?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.user?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.comment?.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        setSearchResults(filtered);
        

        const totalPagesCalc = Math.ceil(filtered.length / limit);
        const startIndex = (pageValue - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        setCommentVideo(paginatedData);
        setTotalPages(totalPagesCalc);
        setPage(pageValue);
      }
    } catch (error) {
      console.log(error);
      setCommentVideo([]);
    } finally {
      setLoading(false);
    }
  };
;

  useEffect(() => {
    getCommentsVideo(1);
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchAllComments(searchUser, 1);
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (isSearchMode && searchUser.trim()) {
      // Nếu đang search, phân trang trong kết quả search
      const startIndex = (newPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = searchResults.slice(startIndex, endIndex);
      
      setCommentVideo(paginatedData);
      setPage(newPage);
    } else {
      // Nếu không search, load data thường theo page
      setSearchUser('');
      setIsSearchMode(false);
      getCommentsVideo(newPage);
    }
  };

  // Xử lý clear search
  const handleClearSearch = () => {
    setSearchUser('');
    setIsSearchMode(false);
    setSearchResults([]);
    getCommentsVideo(1);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách bình luận video</h2>
      <div className="flex gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
        {isSearchMode && (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handleClearSearch}
          >
            Xóa tìm kiếm
          </button>
        )}
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
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Nội dung bình luận</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Thông tin người dùng</th>
            </tr>
          </thead>
          <tbody>
            {commentVideo.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Không có bình luận nào.</td>
              </tr>
            ) : (
              commentVideo.map((item, idx) => (
                <tr key={item._id || idx} className="border-b cursor-pointer" onClick={() => handleOpenDialog(item)}>
                  <td className="px-4 py-2 border">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2 border">{item.comment || ''}</td>
                  <td className="px-4 py-2 border">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</td>
                  <td className="px-4 py-2 border">
                    {item.user ? (
                      <div>
                        <div><span>Email: {item.user.email}</span></div>
                        <div><span>Name: {item.user.fullName}</span></div>
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {/* Pagination với số trang */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          «
        </button>
        
        {/* Hiển thị các số trang */}
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === page;
          
          // Chỉ hiển thị 7 trang: current ± 3
          const showPage = 
            pageNumber === 1 || 
            pageNumber === totalPages || 
            (pageNumber >= page - 2 && pageNumber <= page + 2);
            
          if (!showPage) {
            // Hiển thị "..." nếu có khoảng cách
            if (pageNumber === page - 3 || pageNumber === page + 3) {
              return <span key={pageNumber} className="px-2">...</span>;
            }
            return null;
          }

          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 border rounded ${
                isCurrentPage 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          »
        </button>
      </div>
      <DialogCommentVideo
        open={openDialog}
        handleClose={handleCloseDialog}
        comment={selectedComment}
        videoId={selectedComment?.videoId}
      />
    </div>
  );
}

export default CommentVideo