import React, { useState, useEffect } from 'react';
import {
  fetchChannels,
  fetchCategories,
  handleAPIError
} from './YouTubeAPI';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
  Progress,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const YouTubeChannelsStats = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChannels: 0,
    totalCategories: 0,
    channelsByCategory: {},
    recentChannels: []
  });

  // Fetch tất cả channels để tính thống kê
  const fetchAllChannelsData = async () => {
    try {
      setLoading(true);
      
      // Fetch nhiều trang để lấy tất cả channels
      let allChannels = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await fetchChannels(currentPage, 50);
        if (response && response.data && response.data.length > 0) {
          allChannels = [...allChannels, ...response.data];
          currentPage++;
          // Kiểm tra xem còn trang nào không
          hasMore = response.data.length === 50;
        } else {
          hasMore = false;
        }
      }
      
      setChannels(allChannels);
      calculateStats(allChannels);
    } catch (error) {
      console.error('Lỗi khi fetch channels:', error);
      alert(handleAPIError(error, 'Lỗi khi tải dữ liệu channels'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Lỗi khi fetch categories:', error);
    }
  };

  // Tính toán thống kê
  const calculateStats = (channelsData) => {
    const channelsByCategory = {};
    const recentChannels = [...channelsData]
      .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
      .slice(0, 5);

    // Đếm channels theo category
    channelsData.forEach(channel => {
      const categoryName = channel.category?.name || 'Không có category';
      channelsByCategory[categoryName] = (channelsByCategory[categoryName] || 0) + 1;
    });

    setStats({
      totalChannels: channelsData.length,
      totalCategories: Object.keys(channelsByCategory).length,
      channelsByCategory,
      recentChannels
    });
  };

  useEffect(() => {
    fetchAllChannelsData();
    fetchCategoriesData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Header */}
      <Card>
        <CardHeader variant="gradient" color="red" className="mb-8 p-6">
          <Typography variant="h3" color="white" className="flex items-center gap-2">
            <ChartBarIcon className="h-8 w-8" />
            Thống kê YouTube Channels
          </Typography>
          <Typography variant="paragraph" color="white" className="mt-2 opacity-80">
            Tổng quan về các kênh YouTube được theo dõi
          </Typography>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Tổng Channels
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.totalChannels}
                </Typography>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <PlayCircleIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Tổng Categories
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.totalCategories}
                </Typography>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <TagIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Channels có Category
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {channels.filter(c => c.category).length}
                </Typography>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Channels không có Category
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {channels.filter(c => !c.category).length}
                </Typography>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channels by Category */}
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Phân bố Channels theo Category
            </Typography>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              {Object.entries(stats.channelsByCategory)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([category, count]) => {
                  const percentage = (count / stats.totalChannels) * 100;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {category}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </div>
                      <Progress value={percentage} color="blue" />
                    </div>
                  );
                })}
            </div>
          </CardBody>
        </Card>

        {/* Recent Channels */}
        <Card>
          <CardHeader variant="gradient" color="green" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Channels mới nhất
            </Typography>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              {stats.recentChannels.map((channel, index) => (
                <div key={channel._id || channel.channelId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {channel.imageThumbnail ? (
                      <img
                        src={channel.imageThumbnail}
                        alt={channel.title}
                        className="w-12 h-12 object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
                      style={{display: channel.imageThumbnail ? 'none' : 'flex'}}
                    >
                      <UserGroupIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="small" color="blue-gray" className="font-medium truncate">
                      {channel.title}
                    </Typography>
                    <Typography variant="small" color="gray" className="truncate">
                      {channel.category?.name || 'Không có category'}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="small" color="gray">
                      #{index + 1}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader variant="gradient" color="purple" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Tóm tắt
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {stats.totalChannels}
              </Typography>
              <Typography variant="small" color="gray">
                Tổng số channels được theo dõi
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {stats.totalCategories}
              </Typography>
              <Typography variant="small" color="gray">
                Categories khác nhau
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {((channels.filter(c => c.category).length / stats.totalChannels) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="small" color="gray">
                Channels đã được phân loại
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default YouTubeChannelsStats;
