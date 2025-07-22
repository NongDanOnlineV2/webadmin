import React, { useState, useMemo, useEffect } from 'react';
import HlsPlayer from './HlsPlayer';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Audio } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { Typography, Button, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { Dialog } from '@material-tailwind/react';
import VideoLikeList from './VideoLikeList';
import CommentVideo from './commentVideo';
//import Hls from 'hls.js';
import {deletevideo, approvevideo} from './VideoById';

const fetchVideos = async (page, limit, searchTerm = '', status = '') => {
  const token = localStorage.getItem('token');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (searchTerm) {
    params.append('search', searchTerm);
  }
  
  if (status) {
    params.append('status', status);
  }
  
  const res = await axios.get(`${BaseUrl}/admin-video-farm?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return {
    videos: res.data.data || [],
    totalPages: res.data.totalPages || 1,
    totalCount: res.data.totalCount || 0
  };
};

const fetchAllStatuses = async () => {
  return ['pending', 'uploaded', 'failed', 'deleted'];
};

export const ListVideo = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [openLikeDialog, setOpenLikeDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedVideoForLike, setSelectedVideoForLike] = useState(null);
  const [selectedVideoForComment, setSelectedVideoForComment] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', video: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingVideos, setPlayingVideos] = useState({});
  const [videoCache, setVideoCache] = useState({});
  const limit = 9;

  const getStatusInVietnamese = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'uploaded':
        return 'Đã duyệt';
      case 'failed':
        return 'Thất bại';
      case 'deleted':
        return 'Đã xóa';
      default:
        return status; 
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Clear cache function
  const clearCache = () => {
    console.log('🗑️ Clear cache');
    setVideoCache({});
  };

  // Load videos khi page, search, hoặc filter thay đổi
  useEffect(() => {
    const loadVideos = async () => {
      // Tạo cache key duy nhất cho mỗi combination
      const cacheKey = `${page}-${actualSearchTerm}-${filterStatus}`;
      
      // Kiểm tra cache trước
      if (videoCache[cacheKey]) {
        console.log('📦 Load từ cache:', cacheKey);
        const cachedData = videoCache[cacheKey];
        setVideos(cachedData.videos);
        setTotalPages(cachedData.totalPages);
        setTotalCount(cachedData.totalCount);
        setLoading(false);
        return;
      }

      console.log('🔄 Gọi API cho:', cacheKey);
      setLoading(true);
      try {
        const result = await fetchVideos(page, limit, actualSearchTerm, filterStatus);
        setVideos(result.videos);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        
        // Lưu vào cache
        setVideoCache(prev => ({
          ...prev,
          [cacheKey]: {
            videos: result.videos,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            timestamp: Date.now()
          }
        }));
      } catch (err) {
        console.error("Lỗi khi tải video:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [page, actualSearchTerm, filterStatus]); 

  const togglePlayVideo = (videoId) => { 
    setPlayingVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleOpenLikeDialog = (video) => {
    setSelectedVideoForLike(video);
    setOpenLikeDialog(true);
  };

  const handleCloseLikeDialog = () => {
    setOpenLikeDialog(false);
    setSelectedVideoForLike(null);
  };

  const handleOpenCommentDialog = (video) => {
    setSelectedVideoForComment(video);
    setOpenCommentDialog(true);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
    setSelectedVideoForComment(null);
  };

  const openConfirmDialog = (type, video) => {
    if (!video || !video._id) {
      console.error('Video không hợp lệ:', video);
      return;
    }
    setConfirmDialog({ open: true, type, video });
  };

  return (
    <div className="p-4">
      <Typography variant="h5" color="blue-gray" className="font-semibold mb-4">
        Quản lý Video 
      </Typography>
      {actualSearchTerm && (
        <div className="mb-4 p-2 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            Kết quả tìm kiếm cho: "<strong>{actualSearchTerm}</strong>"
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center w-full h-40">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : videos.length === 0 ? (
        <span className="text-gray-500">Không có video nào.</span>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center relative cursor-pointer"
               onClick={() => togglePlayVideo(item._id)}
               >
                {playingVideos[item._id] ? (
                  <>
                {item.youtubeLink ? (
                  item.youtubeLink.endsWith('.m3u8') ? (
                    <HlsPlayer src={item.youtubeLink.startsWith('http') ? item.youtubeLink : `${BaseUrl}${item.youtubeLink}`} className="w-full h-full object-cover rounded-t-lg" />
                  ) : item.youtubeLink.endsWith('.mp4') ? (
                    <video
                      src={item.youtubeLink.startsWith('http') ? item.youtubeLink : `${BaseUrl}${item.youtubeLink}`}
                      controls
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Trình duyệt của bạn không hỗ trợ video
                    </video>
                  ) : (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(item.youtubeLink) ? (
                    <iframe
                      src={
                        "https://www.youtube.com/embed/" +
                        (item.youtubeLink.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/)?.[1] || "")
                      }
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-t-lg"
                    ></iframe>
                  ) : (
                    <audio
                      src={item.youtubeLink.startsWith('http') ? item.youtubeLink : `${BaseUrl}${item.youtubeLink}`}
                      controls
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Trình duyệt của bạn không hỗ trợ audio
                    </audio>
                  ))
                ) : item.localFilePath ? (
                  item.localFilePath.endsWith('.m3u8') ? (
                    <HlsPlayer src={item.localFilePath.startsWith('http') ? item.localFilePath : `${BaseUrl}${item.localFilePath}`} className="w-full h-full object-cover rounded-t-lg" />
                  ) : item.localFilePath.endsWith('.mp4') ? (
                    <video
                      src={item.localFilePath.startsWith('http') ? item.localFilePath : `${BaseUrl}${item.localFilePath}`}
                      controls
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Trình duyệt của bạn không hỗ trợ video
                    </video>
                  ) : (
                    <audio
                      src={item.localFilePath.startsWith('http') ? item.localFilePath : `${BaseUrl}${item.localFilePath}`}
                      controls
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Trình duyệt của bạn không hỗ trợ audio
                    </audio>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-red-500 font-semibold">
                    Video không tồn tại
                  </div>
                )}
                </>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    <span className="text-sm"> ▶ Nhấn để phát video</span> 
                  </div>
              )}
              </div>
              <div className="p-4">

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 mr-2">
                    {item.title}
                  </h3>
                
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <Button
                        variant="text"
                        size="sm"
                        className="p-1 min-w-0 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </Button>
                    </MenuHandler>
                    <MenuList className="min-w-[120px]">
                      {item.status === 'pending' && (
                        <MenuItem 
                          onClick={() => openConfirmDialog('approve', item)}
                          className="flex items-center gap-2 text-green-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Duyệt video
                        </MenuItem>
                      )}
                      <MenuItem 
                        onClick={() => openConfirmDialog('delete', item)}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa video
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Thuộc Farm:</span> {item.farmId?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Danh sách phát:</span> {item.playlistName}
                  </div>
                  <div>
                    <span className="font-medium">Ngày đăng:</span> {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium cursor-pointer hover:text-blue-600 transition-colors"  
                    onClick={() => {
                       const authorId = item.uploadedBy?._id || item.uploadedBy?.id || item.uploadedBy;
                       if (authorId) {
                         navigate(`/dashboard/users/${authorId}`);
                       }
                     }}
                     title="Xem chi tiết người dùng">Người đăng: {item.uploadedBy?.fullName}</span> 
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <div className="break-all text-gray-700 mt-1">{item.uploadedBy?.email}</div>
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'deleted' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusInVietnamese(item.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLikeDialog(item);
                    }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <span>❤️</span>
                    <span className="text-sm">Xem lượt thích</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCommentDialog(item);
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>💬</span>
                    <span className="text-sm">Xem bình luận</span>
                  </button>
                </div>
              </div>

            
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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

      {/* Like Dialog */}
      {openLikeDialog && selectedVideoForLike && (
        <VideoLikeList 
          openLike={openLikeDialog} 
          handleCloseLike={handleCloseLikeDialog}
          videoId={selectedVideoForLike._id}
        />
      )}

      {/* Comment Dialog */}
      {openCommentDialog && selectedVideoForComment && (
        <CommentVideo
          open={openCommentDialog}
          onClose={handleCloseCommentDialog}
          videoId={selectedVideoForComment._id}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <Dialog 
          open={confirmDialog.open} 
          handler={() => setConfirmDialog({ open: false, type: '', video: null })}
          size="sm"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                confirmDialog.type === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {confirmDialog.type === 'approve' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirmDialog.type === 'approve' ? 'Xác nhận duyệt video' : 'Xác nhận xóa video'}
                </h3>
                <p className="text-sm text-gray-600">
                  {confirmDialog.video?.title}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              {confirmDialog.type === 'approve' 
                ? 'Bạn có chắc chắn muốn duyệt video này? Video sẽ được chuyển sang trạng thái "Đã duyệt".'
                : 'Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác.'
              }
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outlined" 
                onClick={() => setConfirmDialog({ open: false, type: '', video: null })}
              >
                Hủy
              </Button>
              <Button 
                color={confirmDialog.type === 'approve' ? 'green' : 'red'}
                disabled={isProcessing}
                onClick={async () => {
                  if (isProcessing) return;
                  setIsProcessing(true);
                  
                  try {
                    if (confirmDialog.type === 'approve') {
                      // Gọi API approve trực tiếp
                      const result = await approvevideo(confirmDialog.video._id);
                      
                      if (result?.success) {
                        alert("✅ Duyệt video thành công!");
                        setConfirmDialog({ open: false, type: '', video: null });
                        // Clear cache và reload trang hiện tại
                        clearCache();
                        const updatedVideos = await fetchVideos(page, limit, actualSearchTerm, filterStatus);
                        setVideos(updatedVideos.videos);
                        setTotalPages(updatedVideos.totalPages);
                        setTotalCount(updatedVideos.totalCount);
                      } else {
                        alert(`❌ Lỗi khi duyệt video: ${result?.message || 'Unknown error'}`);
                      }
                    } else {
                      // Gọi API delete trực tiếp
                      const result = await deletevideo(confirmDialog.video._id);
                      
                      if (result?.success) {
                        alert("✅ Xóa video thành công!");
                        setConfirmDialog({ open: false, type: '', video: null });
                        clearCache();
                        const updatedVideos = await fetchVideos(page, limit, actualSearchTerm, filterStatus);
                        setVideos(updatedVideos.videos);
                        setTotalPages(updatedVideos.totalPages);
                        setTotalCount(updatedVideos.totalCount);
                      } else {
                        alert(`❌ Lỗi khi xóa video: ${result?.message || 'Unknown error'}`);
                      }
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert(`❌ Có lỗi xảy ra: ${error.message || error}`);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
              >
                {isProcessing 
                  ? 'Đang xử lý...' 
                  : confirmDialog.type === 'approve' ? 'Duyệt video' : 'Xóa video'
                }
              </Button>
            </div>
          </div>
        </Dialog>
      )}
       
    </div>
  );
};

export default ListVideo;