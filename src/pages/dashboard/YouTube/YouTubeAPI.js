import axios from 'axios';

const BASE_URL = 'https://api-ndolv2.nongdanonline.cc';

// Cache để lưu trữ dữ liệu tạm thời
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Helper function để lấy config với token
const getConfig = () => {
  const token = localStorage.getItem('token');
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };
};

// Helper function để lấy config cho file upload
const getFormDataConfig = () => {
  const token = localStorage.getItem('token');
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    } 
  };
};

// Cache helper functions
const getCacheKey = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return `${endpoint}?${queryString}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Retry logic
const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.response?.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

// ==================== VIDEO APIs ====================

// Lấy danh sách video với phân trang và caching
export const fetchVideos = async (page = 1, limit = 20) => {
  const cacheKey = getCacheKey('/admin-video-farm', { page, limit });
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() => 
      axios.get(`${BASE_URL}/admin-video-farm?limit=${limit}&page=${page}`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch videos:', error);
    throw error;
  }
};

// Xóa video
export const deleteVideo = async (videoId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin-video-farm/${videoId}`,
      getConfig()
    );
    
    // Clear cache sau khi xóa
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa video:', error);
    throw error;
  }
};

// Duyệt video
export const approveVideo = async (videoId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/admin-video-farm/${videoId}/approve`,
      {},
      getConfig()
    );
    
    // Clear cache sau khi duyệt
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi duyệt video:', error);
    throw error;
  }
};

// Lấy danh sách likes của video với caching
export const fetchVideoLikes = async (videoId) => {
  const cacheKey = getCacheKey(`/video-like/${videoId}/users`);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/video-like/${videoId}/users`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch video likes:', error);
    throw error;
  }
};

// Lấy danh sách comments của video với caching
export const fetchVideoComments = async (videoId) => {
  const cacheKey = getCacheKey(`/video-comment/${videoId}/comments`);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/video-comment/${videoId}/comments`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch video comments:', error);
    throw error;
  }
};

// ==================== CHANNEL APIs ====================

// Lấy danh sách channels với caching
export const fetchChannels = async (page = 1, limit = 10) => {
  const cacheKey = getCacheKey('/youtube/channels', { page, limit });
  const cached = getFromCache(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/youtube/channels?page=${page}&limit=${limit}`, getConfig())
    );

    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch channels:', error);
    throw error;
  }
};

// Lấy videos của channel với caching
export const fetchChannelVideos = async (channelId) => {
  const cacheKey = getCacheKey(`/youtube/videos/channel/${channelId}`);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/youtube/videos/channel/${channelId}`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch channel videos:', error);
    throw error;
  }
};

// Fetch n video mới nhất từ channel
export const fetchLatestVideos = async (channelId, count = 10) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/youtube/fetch-videos`,
      { channelId, count },
      getConfig()
    );
    
    // Clear cache sau khi fetch videos mới
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi fetch latest videos:', error);
    throw error;
  }
};

// Subscribe to channel
export const subscribeToChannel = async (channelId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/youtube/subscribe`,
      { channelId },
      getConfig()
    );
    
    // Clear cache sau khi subscribe
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi subscribe channel:', error);
    throw error;
  }
};

// Unsubscribe from channel
export const unsubscribeFromChannel = async (channelId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/youtube/unsubscribe`,
      { channelId },
      getConfig()
    );
    
    // Clear cache sau khi unsubscribe
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi unsubscribe channel:', error);
    throw error;
  }
};

// Lấy channels theo category với caching
export const fetchChannelsByCategory = async (categoryId) => {
  const cacheKey = getCacheKey(`/youtube/channels/category/${categoryId}`);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/youtube/channels/category/${categoryId}`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch channels by category:', error);
    throw error;
  }
};

// Cập nhật thông tin channel
export const updateChannel = async (channelId, data) => {
  try {
    const formData = new FormData();
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    if (data.categoryId) {
      formData.append('categoryId', data.categoryId);
    }

    const response = await axios.put(
      `${BASE_URL}/youtube/channels/${channelId}`,
      formData,
      getFormDataConfig()
    );
    
    // Clear cache sau khi update
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi update channel:', error);
    throw error;
  }
};

// ==================== CATEGORY APIs ====================

// Lấy danh sách categories với caching
export const fetchCategories = async (page = 1, limit = 20) => {
  const cacheKey = getCacheKey('/youtube/categories', { page, limit });
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`${BASE_URL}/youtube/categories?page=${page}&limit=${limit}`, getConfig())
    );
    
    const result = response.data;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi fetch categories:', error);
    throw error;
  }
};

// Tạo category mới
export const createCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    if (categoryData.thumbnail) {
      formData.append('imageThumbnail', categoryData.thumbnail);
    }

    // Log request data
    console.log('Creating category with data:', {
      name: categoryData.name,
      description: categoryData.description,
      hasFile: !!categoryData.thumbnail,
      fileInfo: categoryData.thumbnail ? {
        name: categoryData.thumbnail.name,
        type: categoryData.thumbnail.type,
        size: categoryData.thumbnail.size
      } : null
    });

    const response = await axios.post(
      `${BASE_URL}/youtube/categories`,
      formData,
      getFormDataConfig()
    );
    
    // Clear cache sau khi tạo category
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo category:', error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    if (categoryData.thumbnail) {
      formData.append('thumbnail', categoryData.thumbnail);
    }

    const response = await axios.put(
      `${BASE_URL}/youtube/categories/${categoryId}`,
      formData,
      getFormDataConfig()
    );
    
    // Clear cache sau khi update category
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi update category:', error);
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/youtube/categories/${categoryId}`,
      getConfig()
    );
    
    // Clear cache sau khi xóa category
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa category:', error);
    throw error;
  }
};

// ==================== CALLBACK APIs ====================

// Verify callback từ YouTube WebSub
export const verifyCallback = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/youtube/callback`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi verify callback:', error);
    throw error;
  }
};

// Nhận thông báo video mới từ YouTube
export const receiveVideoNotification = async (notificationData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/youtube/callback`,
      notificationData,
      getConfig()
    );
    
    // Clear cache sau khi nhận notification
    cache.clear();
    return response.data;
  } catch (error) {
    console.error('Lỗi khi nhận notification:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Tính toán thống kê tổng quan
export const calculateOverallStats = (videos, videoStats) => {
  let totalLikes = 0;
  let totalComments = 0;
  let totalViews = 0;
  const uniqueUsers = new Set();
  
  videos.forEach(video => {
    const stats = videoStats[video._id] || { likes: 0, comments: 0 };
    totalLikes += stats.likes;
    totalComments += stats.comments;
    totalViews += video.viewCount || 0;
    if (video.uploadedBy?.id) {
      uniqueUsers.add(video.uploadedBy.id);
    }
  });
  
  const approvedVideos = videos.filter(v => v.status === 'uploaded').length;
  const pendingVideos = videos.filter(v => v.status === 'pending').length;
  const approvalRate = videos.length > 0 ? Math.round((approvedVideos / videos.length) * 100) : 0;
  
  return {
    totalVideos: videos.length,
    approvedVideos,
    pendingVideos,
    totalLikes,
    totalComments,
    totalViews,
    uniqueUsers: uniqueUsers.size,
    approvalRate
  };
};

// Format date helper
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lấy YouTube ID từ URL
export const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/);
  return match ? match[1] : null;
};

// Error handler với thông tin chi tiết hơn
export const handleAPIError = (error, customMessage = 'Có lỗi xảy ra') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server trả về response với status code lỗi
    const status = error.response.status;
    const message = error.response.data?.message || customMessage;
    
    switch (status) {
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 403:
        return 'Bạn không có quyền thực hiện hành động này.';
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu.';
      case 429:
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      case 500:
        return 'Lỗi server. Vui lòng thử lại sau.';
      case 502:
        return 'Lỗi gateway. Vui lòng thử lại sau.';
      case 503:
        return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
      default:
        return message;
    }
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
  } else {
    // Lỗi khác
    return customMessage;
  }
};

// Clear cache function
export const clearCache = () => {
  cache.clear();
  console.log('Cache đã được xóa');
};

// Get cache stats
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}; 