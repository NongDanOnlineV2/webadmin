import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Audio } from 'react-loader-spinner';

export default function VideoLikeList({ openLike, handleCloseLike, videoId }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem('token');

  const getLikes = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get(`${BaseUrl}/video-like/${videoId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let userList = [];
      let count = 0;
      
      if (res.data) {
        // Xử lý response data
        if (Array.isArray(res.data)) {
          userList = res.data;
          count = res.data.length;
        } else if (res.data.users && Array.isArray(res.data.users)) {
          userList = res.data.users;
          count = res.data.users.length;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          userList = res.data.data;
          count = res.data.data.length;
        } else if (typeof res.data === 'object') {
          count = res.data.total || res.data.count || res.data.likeCount || 0;
          userList = res.data.users || res.data.data || [];
        }
      }
      
      setLikes(userList);
      setLikeCount(count);
    } catch (error) {
      console.error('Lỗi lấy danh sách Like:', error);
      setLikes([]);
      setLikeCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openLike && videoId) getLikes();
  }, [openLike, videoId]);

  if (!openLike) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative max-h-[80vh] overflow-hidden">
        <button
          onClick={handleCloseLike}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Danh sách người đã Like</h1>
          <p className="text-gray-600 mt-1">
            <span className="font-semibold text-red-500">{likeCount}</span> người đã thích video này
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Audio height="60" width="60" radius="9" color="green" ariaLabel="loading" />
          </div>
        ) : likeCount === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Chưa có ai like video này</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-96">
            <ul className="space-y-3">
              {likes.map((user, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={
                      user.avatar && user.avatar.startsWith('http')
                        ? user.avatar
                        : user.avatar
                        ? `${BaseUrl}${user.avatar}`
                        : "https://via.placeholder.com/40x40.png?text=👤"
                    }
                    alt={user.fullName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40x40.png?text=👤";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.fullName || 'Người dùng'}
                    </p>
                    {user.email && (
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    )}
                  </div>
                  <div className="text-red-500">
                    ❤️
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}