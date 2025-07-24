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
import {deletevideo, approvevideo} from './VideoById';

const fetchVideos = async (page, limit, searchTerm = '', status = '') => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
  if (status && status !== '') params.append('status', status);

  try {
    const res = await axios.get(`${BaseUrl}/admin-video-farm?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    let videos = [];
    if (Array.isArray(res.data.data)) {
      videos = res.data.data;
    } else if (Array.isArray(res.data)) {
      videos = res.data;
    } else if (typeof res.data === 'object' && res.data !== null) {
      videos = res.data.data || res.data.videos || [];
    }

    return {
      videos,
      totalPages: res.data.totalPages || 1
    };
  } catch (error) {
    console.error('❌ API Error:', error);
    return { videos: [], totalPages: 1 };
  }
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
  const [openLikeDialog, setOpenLikeDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedVideoForLike, setSelectedVideoForLike] = useState(null);
  const [selectedVideoForComment, setSelectedVideoForComment] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', video: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingVideos, setPlayingVideos] = useState({});
  const [videoCache, setVideoCache] = useState({}); 
  const [searchCache, setSearchCache] = useState({}); 
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

  // Khi search, lấy tất cả item có status đã lọc ra (và hỗ trợ phân trang)
  const performSearch = async (customPage = 1) => {
    const searchKey = `${actualSearchTerm}-${filterStatus}-${customPage}`;
    setPage(customPage);

    // Nếu đã có cache cho search này thì dùng luôn
    if (searchCache[searchKey]) {
      setVideos(searchCache[searchKey].videos);
      setTotalPages(searchCache[searchKey].totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Gọi API với search và status, truyền đúng page
      const result = await fetchVideos(customPage, limit, actualSearchTerm, filterStatus);
      setVideos(result.videos || []);
      setTotalPages(result.totalPages || 1);
      // Lưu cache cho search này
      setSearchCache(prev => ({
        ...prev,
        [searchKey]: {
          videos: result.videos || [],
          totalPages: result.totalPages || 1,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      setVideos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    setPage(1);
    setSearchCache({});
    setVideoCache({});
    if (actualSearchTerm) {
      performSearch();
    }
  };

  // Khi clear search/filter
  const clearSearch = () => {
    setSearchText('');
    setActualSearchTerm('');
    setFilterStatus('');
    setPage(1);
    setSearchCache({});
    setVideoCache({});
  };

  // Khi nhấn nút tìm kiếm
  const handleSearchClick = () => {
    setActualSearchTerm(searchText.trim());
    performSearch(1);
  };

  // Khi chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (actualSearchTerm) {
      performSearch(newPage);
    }
    // Nếu không search thì useEffect sẽ tự xử lý
  };

  // USEEFFECT VỚI CACHE
  useEffect(() => {
    // Nếu đang search thì không gọi lại ở đây, đã xử lý trong performSearch
    if (actualSearchTerm) return;

    const loadVideos = async () => {
      // Nếu đang search thì ưu tiên cache search
      if (actualSearchTerm) {
        const searchKey = `${actualSearchTerm}-${filterStatus}`;
        if (searchCache[searchKey]) {
          setVideos(searchCache[searchKey].videos);
          setTotalPages(searchCache[searchKey].totalPages);
          setLoading(false);
          return;
        }
        // Nếu chưa có cache search thì gọi lại performSearch
        performSearch();
        return;
      }

      // Nếu không search thì dùng cache phân trang như cũ
      const cacheKey = `${page}-${actualSearchTerm}-${filterStatus}`;
      if (videoCache[cacheKey]) {
        setVideos(videoCache[cacheKey].videos);
        setTotalPages(videoCache[cacheKey].totalPages);
        setLoading(false);
        return;
      }

      setLoading(true);
      fetchVideos(page, limit, '', filterStatus)
        .then(result => {
          setVideos(result.videos || []);
          setTotalPages(result.totalPages || 1);
          setVideoCache(prev => ({
            ...prev,
            [cacheKey]: {
              videos: result.videos || [],
              totalPages: result.totalPages || 1,
              timestamp: Date.now()
            }
          }));
        })
        .catch(() => {
          setVideos([]);
          setTotalPages(1);
        })
        .finally(() => setLoading(false));
    };

    loadVideos();
  }, [page, actualSearchTerm, filterStatus, videoCache, searchCache]);

  // HÀM DỌN DẸP CACHE CŨ (option - chạy mỗi 5 phút)
  useEffect(() => {
    const cleanupCache = () => {
      const now = Date.now();
      const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5 phút
      
      setVideoCache(prev => {
        const newCache = {};
        Object.keys(prev).forEach(key => {
          if (now - prev[key].timestamp < CACHE_EXPIRE_TIME) {
            newCache[key] = prev[key];
          }
        });
        
        if (Object.keys(newCache).length !== Object.keys(prev).length) {
        }
        
        return newCache;
      });
    };

    const interval = setInterval(cleanupCache, 5 * 60 * 1000); // Cleanup mỗi 5 phút
    return () => clearInterval(interval);
  }, []);

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
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" color="blue-gray" className="font-semibold">
          Quản lý Video
        </Typography>
        <Button 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </Button>
      </div>


      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm video
            </label>
            <div className="relative flex gap-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={e => { if (e.key === 'Enter') handleSearchClick(); }}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                size="sm"
                onClick={handleSearchClick}
                className="flex items-center gap-2 px-4 py-2"
                disabled={loading}
              >
                Tìm kiếm
              </Button>
              {actualSearchTerm && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={clearSearch}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="uploaded">Đã duyệt</option>
              <option value="failed">Thất bại</option>
              <option value="deleted">Đã xóa</option>
            </select>
          </div>
        </div>

        {(actualSearchTerm || filterStatus) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700">
                {actualSearchTerm && (
                  <span>
                    <span className="font-medium">Tìm kiếm:</span> "{actualSearchTerm}"
                  </span>
                )}
                {actualSearchTerm && filterStatus && <span className="mx-2">•</span>}
                {filterStatus && (
                  <span>
                    <span className="font-medium">Trạng thái:</span> {getStatusInVietnamese(filterStatus)}
                  </span>
                )}
              </p>
              <button
                onClick={clearSearch}
                className="text-blue-700 hover:text-blue-900 text-sm font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-40">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : (
        <>
          {Array.isArray(videos) && videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {(actualSearchTerm || filterStatus) ? 'Không tìm thấy video nào' : 'Chưa có video nào'}
              </h3>
              <p className="text-gray-500">
                {actualSearchTerm 
                  ? `Không có video nào khớp với từ khóa "${actualSearchTerm}"`
                  : filterStatus
                  ? `Không có video nào với trạng thái "${getStatusInVietnamese(filterStatus)}"`
                  : 'Các video sẽ hiển thị ở đây khi có'
                }
              </p>
              {(actualSearchTerm || filterStatus) && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => { setSearchText(''); setActualSearchTerm(''); setFilterStatus(''); setPage(1); }}
                  className="mt-4"
                >
                  Xóa bộ lọc
                </Button>
              )}
              {/* Báo lỗi rõ ràng khi không có kết quả tìm kiếm */}
              {actualSearchTerm && videos.length === 0 && (
                <div className="mt-2 text-red-600 font-semibold">
                  Không tìm thấy kết quả nào cho từ khóa: <span className="font-bold">"{actualSearchTerm}"</span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(videos) &&
                // LỌC LẠI TRÊN UI ĐỂ ĐẢM BẢO CHỈ HIỆN ĐÚNG TRẠNG THÁI (nếu backend trả về sai)
                [...videos]
                  .filter(item => !filterStatus || item.status === filterStatus)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item, index) => (
                <div key={item._id || index} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
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
                          {item.status !== 'deleted' ? (
                            <MenuItem 
                              onClick={() => openConfirmDialog('delete', item)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa video
                            </MenuItem>
                          ):
                          (
                            <MenuItem 
                            disabled
    
                              className="flex items-center gap-2 text-red-600 cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Đã xóa 
                            </MenuItem>
                          )
                          
                          }
                        </MenuList>
                      </Menu>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Thuộc Farm:</span> {item.farmId?.name || 'N/A'}
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
                        <span className="font-medium">Email: {item.uploadedBy?.email}</span>
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
                        <span className="text-sm">{item.likeCount}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCommentDialog(item);
                        }}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span>💬</span>
                        <span className="text-sm">{item.commentCount||0}</span>
                      </button>
                    </div>
                  </div>

                
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {Array.isArray(videos) && videos.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6 bg-white rounded-lg shadow-sm p-4">
          <Button
            size="sm"
            variant="outlined"
            disabled={page <= 1 || loading}
            onClick={() => handlePageChange(page - 1)}
          >
            Trang trước
          </Button>
          <span className="mx-4 text-sm font-medium text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outlined"
            disabled={page >= totalPages || loading}
            onClick={() => handlePageChange(page + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}

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
                        const updatedVideos = await fetchVideos(page, limit, actualSearchTerm, filterStatus);
                        setVideos(updatedVideos.videos);
                        setTotalPages(updatedVideos.totalPages);
                      } else {
                        alert(`❌ Lỗi khi duyệt video: ${result?.message || 'Unknown error'}`);
                      }
                    } else {
                      // Gọi API delete trực tiếp
                      const result = await deletevideo(confirmDialog.video._id);
                      
                      if (result?.success) {
                        alert("✅ Xóa video thành công!");
                        setConfirmDialog({ open: false, type: '', video: null });
                        const updatedVideos = await fetchVideos(page, limit, actualSearchTerm, filterStatus);
                        setVideos(updatedVideos.videos);
                        setTotalPages(updatedVideos.totalPages);
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