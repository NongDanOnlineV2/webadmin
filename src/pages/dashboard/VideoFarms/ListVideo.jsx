import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Audio } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { Typography, Button, Input, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { Dialog } from '@material-tailwind/react';
import VideoLikeList from './VideoLikeList';
import CommentVideo from './commentVideo';
import {deletevideo, approvevideo} from './VideoById';
const fetchAllVideos = async () => {
  const token = localStorage.getItem('token');
  let page = 1;
  let totalPages = 1;
  let allVideos = [];

  while (page <= totalPages) {
    const res = await axios.get(`${BaseUrl}/admin-video-farm?limit=100&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    totalPages = res.data.totalPages || 1;
    const videos = res.data.data || [];
    allVideos = [...allVideos, ...videos];
    page++;
  }

  return allVideos;
};

export const ListVideo = () => {
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [openLikeDialog, setOpenLikeDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedVideoForLike, setSelectedVideoForLike] = useState(null);
  const [selectedVideoForComment, setSelectedVideoForComment] = useState(null);
  const [videoStats, setVideoStats] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', video: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const limit = 10;

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

 const filteredVideos = useMemo(() => {
  const filtered = filterStatus
    ? allVideos.filter(v => v.status === filterStatus)
    : allVideos;

  const searched = filtered.filter(v =>
    v.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    v.playlistName?.toLowerCase().includes(searchText.toLowerCase())
  );

 
  return searched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}, [allVideos, filterStatus, searchText]);


  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredVideos.slice(start, start + limit);
  }, [filteredVideos, page]);


const handleOpenLikeDialog = (video) => {
  setSelectedVideoForLike(video);
  setOpenLikeDialog(true);
};

const handleCloseLikeDialog = () => {
  setOpenLikeDialog(false);
  setSelectedVideoForLike(null);
  // Refresh stats after closing like dialog
  if (paginatedVideos.length > 0) {
    const videoIds = paginatedVideos.map(v => v._id);
    fetchVideoStats(videoIds);
  }
};

const handleOpenCommentDialog = (video) => {
  setSelectedVideoForComment(video);
  setOpenCommentDialog(true);
};

const handleCloseCommentDialog = () => {
  setOpenCommentDialog(false);
  setSelectedVideoForComment(null);
  // Refresh stats after closing comment dialog
  if (paginatedVideos.length > 0) {
    const videoIds = paginatedVideos.map(v => v._id);
    fetchVideoStats(videoIds);
  }
};

const fetchVideoStats = async (videoIds) => {
  const token = localStorage.getItem('token');
  const stats = {};
    
  try {
    const promises = videoIds.map(async (videoId) => {
      try {
   
        let likeCount = 0;        
        const likeEndpoints = [
          { url: `${BaseUrl}/video-like/${videoId}/users`, name: 'video-like-users' },
          { url: `${BaseUrl}/video-like/${videoId}`, name: 'video-like' },
          { url: `${BaseUrl}/admin-video-like/${videoId}/users`, name: 'admin-video-like-users' },
          { url: `${BaseUrl}/admin-video-like/${videoId}`, name: 'admin-video-like' },
          { url: `${BaseUrl}/video-like/${videoId}/count`, name: 'video-like-count' },
          { url: `${BaseUrl}/admin-video-like/${videoId}/count`, name: 'admin-video-like-count' },
          { url: `${BaseUrl}/video/${videoId}/like-count`, name: 'video-like-count-alt' },
          { url: `${BaseUrl}/like/video/${videoId}`, name: 'like-video' },
        ];
        
        for (const { url, name } of likeEndpoints) {
          try {
            const likeRes = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = likeRes.data;
            
            if (data !== null && data !== undefined) {

              if (typeof data === 'number') {
                likeCount = data;
                break;
              } else if (Array.isArray(data)) {
                likeCount = data.length;

                break;
              } else if (typeof data === 'object') {

                if (data.users && Array.isArray(data.users)) {
                  likeCount = data.users.length;
                  break;
                } else if (data.total !== undefined) {
                  likeCount = data.total;
                  break;
                } else if (data.count !== undefined) {
                  likeCount = data.count;
                  break;
                } else if (data.likeCount !== undefined) {
                  likeCount = data.likeCount;
                  break;
                } else if (data.data && Array.isArray(data.data)) {
                  likeCount = data.data.length;
                  break;
                } else if (data.likes && Array.isArray(data.likes)) {
                  likeCount = data.likes.length;
                  break;
                }
              }
            }
          } catch (error) {
            const status = error.response?.status;
            const statusText = error.response?.statusText;
            continue;
          }
        }
        
        let commentCount = 0;
        
        const commentEndpoints = [
          { url: `${BaseUrl}/admin-video-comment/${videoId}`, name: 'admin-video-comment' },
          { url: `${BaseUrl}/video-comment/${videoId}`, name: 'video-comment' },
          { url: `${BaseUrl}/video-comment/${videoId}/comments`, name: 'video-comment-list' },
          { url: `${BaseUrl}/admin-video-comment/${videoId}/comments`, name: 'admin-video-comment-list' },
        ];
        
        for (const { url, name } of commentEndpoints) {
          try {
            const commentRes = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = commentRes.data;
            
            if (data !== null && data !== undefined) {
              if (Array.isArray(data)) {
                commentCount = data.reduce((total, comment) => {
                  const repliesCount = Array.isArray(comment.replies) ? comment.replies.length : 0;
                  return total + 1 + repliesCount;
                }, 0);
                break;
              } else if (data.data && Array.isArray(data.data)) {
                commentCount = data.data.reduce((total, comment) => {
                  const repliesCount = Array.isArray(comment.replies) ? comment.replies.length : 0;
                  return total + 1 + repliesCount;
                }, 0);
                break;
              } else if (typeof data === 'object' && data.count !== undefined) {
                commentCount = data.count;
                break;
              }
            }
          } catch (error) {
            const status = error.response?.status;
            const statusText = error.response?.statusText;
            continue;
          }
        }
        
        stats[videoId] = { likeCount, commentCount };
        
      } catch (error) {
        console.error(`✗ Error fetching stats for video ${videoId}:`, error);
        stats[videoId] = { likeCount: 0, commentCount: 0 };
      }
    });
    
    await Promise.all(promises);

    setVideoStats(prev => {
      const newStats = { ...prev, ...stats };
      return newStats;
    });
  } catch (error) {
    console.error('Error fetching video stats:', error);
  }
};

  useEffect(() => {
    setLoading(true);
    fetchAllVideos()
      .then((videos) => {
        setAllVideos(videos);
      })
      .catch(err => console.error("Lỗi khi tải video:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (paginatedVideos.length > 0) {
      const videoIds = paginatedVideos.map(v => v._id);

      fetchVideoStats(videoIds);
    }
  }, [paginatedVideos]);


  const totalPages = Math.ceil(filteredVideos.length / limit);


const [statusList, setStatusList] = useState([]);
const [hasFetchedAllStatuses, setHasFetchedAllStatuses] = useState(false);

const fetchAllStatuses = async () => {
  const token = localStorage.getItem('token');
  let page = 1;
  let totalPages = 1;
  const statuses = new Set();

  while (page <= totalPages) {
    const res = await axios.get(`${BaseUrl}/admin-video-farm?limit=100&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    totalPages = res.data.totalPages || 1;

    (res.data.data || []).forEach(video => {
      if (video.status) {
        statuses.add(video.status);
      }
    });

    page++;
  }

  return Array.from(statuses);
};

const handleOpenStatusFilter = async () => {
  if (!hasFetchedAllStatuses) {
    const statuses = await fetchAllStatuses();
    setStatusList(statuses);
    setHasFetchedAllStatuses(true);
  }
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

      <div className="flex justify-end mb-4 gap-2">
        <Input
          type="text"
          placeholder="Tìm kiếm video..."
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
     <select
  onClick={handleOpenStatusFilter} 
  className="border rounded px-3 py-1"
  value={filterStatus}
  onChange={(e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  }}
>
  <option value="">Tất cả</option>
  {statusList.map((status) => (
    <option key={status} value={status}>{getStatusInVietnamese(status)}</option>
  ))}
</select>

      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-40">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : paginatedVideos.length === 0 ? (
        <span className="text-gray-500">Không có video nào.</span>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVideos.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              {/* Video Display */}
              <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                {item.status === "pending" && item.localFilePath ? (
                  <video
                    src={
                      item.localFilePath.startsWith('http')
                        ? item.localFilePath
                        : `${BaseUrl}${item.localFilePath}`
                    }
                    controls
                    className="w-full h-full object-cover rounded-t-lg"
                  >
                    Trình duyệt của bạn không hỗ trợ video
                  </video>
                ) : item.youtubeLink && item.status === "uploaded" ? (
                  item.youtubeLink.endsWith('.mp4') ? (
                    <video 
                      src={item.youtubeLink} 
                      controls   
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
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
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-red-500 font-semibold">
                    Video không tồn tại
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                {/* Header với title và menu 3 chấm */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 mr-2">
                    {item.title}
                  </h3>
                  
                  {/* Menu 3 chấm */}
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
                    <span className="font-medium">Người đăng:</span> {item.uploadedBy?.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {item.uploadedBy?.email}
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
                    <span className="text-sm">
                      Lượt thích: {(() => {
                        const count = videoStats[item._id]?.likeCount;
                        return count !== undefined ? count : '...';
                      })()}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCommentDialog(item);
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>💬</span>
                    <span className="text-sm">
                      Bình luận: {(() => {
                        const count = videoStats[item._id]?.commentCount;
                        return count !== undefined ? count : '...';
                      })()}
                    </span>
                  </button>
                </div>
              </div>

            
            </div>
          ))}
        </div>
      )}

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
                      const result = await approvevideo(confirmDialog.video._id, () => {
                        fetchAllVideos().then(setAllVideos);
                      });
                      
                      alert(result?.success ? result.message : "Có lỗi xảy ra khi duyệt video");
                      if (result?.success) setConfirmDialog({ open: false, type: '', video: null });
                    } else {
                      const result = await deletevideo(confirmDialog.video._id, () => {
                        fetchAllVideos().then(setAllVideos);
                      });
                      
                      alert(result?.success ? result.message : "Có lỗi xảy ra khi xóa video");
                      if (result?.success) setConfirmDialog({ open: false, type: '', video: null });
                    }
                  } catch (error) {
                    console.error('Lỗi:', error);
                    alert('Có lỗi xảy ra, vui lòng thử lại');
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
