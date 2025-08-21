import React, { useState, useEffect } from 'react';
import {
  fetchChannels,
  fetchCategories,
  fetchChannelVideos,
  fetchLatestVideos,
  subscribeToChannel,
  unsubscribeFromChannel,
  formatDate,
  handleAPIError
} from './YouTubeAPI';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Chip,
  Spinner,
  Avatar,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const YouTubeChannels = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openChannelDialog, setOpenChannelDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChannels, setTotalChannels] = useState(0);

  // Fetch tất cả channels với phân trang
  const fetchChannelsData = async (page = 1) => {
    try {
      setLoading(true);
      const categoryId = selectedCategory !== 'all' ? selectedCategory : null;
      const response = await fetchChannels(page, 10, categoryId);

      // Cập nhật dữ liệu dựa trên cấu trúc response từ API 
      if (response && response.data) {
        setChannels(response.data);
        setCurrentPage(page);
        setTotalPages(Math.ceil((response.total || response.data.length) / 10));
        setTotalChannels(response.total || response.data.length);
      } else {
        setChannels([]);
        setTotalPages(1);
        setTotalChannels(0);
      }
    } catch (error) {
      console.error('Lỗi khi fetch channels:', error);
      alert(handleAPIError(error, 'Lỗi khi tải danh sách channels'));
      setChannels([]);
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
      alert(handleAPIError(error, 'Lỗi khi tải danh sách categories'));
    }
  };

  // Fetch videos của channel
  const fetchChannelVideosData = async (channelId) => {
    try {
      setFetchingVideos(true);
      const response = await fetchChannelVideos(channelId);
      setChannelVideos(response || []);
    } catch (error) {
      console.error('Lỗi khi fetch channel videos:', error);
      setChannelVideos([]);
    } finally {
      setFetchingVideos(false);
    }
  };

  // Fetch n video mới nhất và lưu vào DB
  const fetchLatestVideosData = async (channelId, count = 10) => {
    try {
      await fetchLatestVideos(channelId, count);
      alert(`Đã fetch ${count} video mới nhất từ channel`);
      fetchChannelsData(); // Refresh danh sách
    } catch (error) {
      console.error('Lỗi khi fetch latest videos:', error);
      alert(handleAPIError(error, 'Có lỗi xảy ra khi fetch videos'));
    }
  };


  // Lọc channels dựa trên cấu trúc dữ liệu từ API
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.channelId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || channel.category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchChannelsData(currentPage);
  }, [selectedCategory]);

  useEffect(() => {
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
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h3" color="white" className="flex items-center gap-2">
            <UserGroupIcon className="h-8 w-8" />
            Quản lý YouTube Channels
          </Typography>
          <Typography variant="paragraph" color="white" className="mt-2 opacity-80">
            Quản lý và theo dõi các kênh YouTube được kết nối
          </Typography>
        </CardHeader>
      </Card>

      {/* Filters và Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm channel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                containerProps={{ className: "min-w-[300px]" }}
              />
            </div>
            
            <Select
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              label="Lọc theo category"
              className="min-w-[200px]"
            >
              <Option value="all">Tất cả categories</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Typography variant="small" color="gray" className="font-normal">
              Trang {currentPage} / {totalPages} - Tổng: {totalChannels} channels
            </Typography>
            <div className="flex gap-2">
              
            </div>
          </div>
        </div>
      </Card>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel._id || channel.channelId} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Channel Thumbnail */}
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {channel.imageThumbnail ? (
                  <img
                    src={`https://api-ndolv2.nongdanonline.cc${channel.imageThumbnail}`}
                    alt={channel.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <UserGroupIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 right-2">
                <Chip
                  value={channel.category?.name || 'Không có category'}
                  color="blue"
                  size="sm"
                />
              </div>
            </div>

            {/* Channel Info */}
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2 line-clamp-2">
                {channel.title}
              </Typography>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(channel.createdAt || channel.updatedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setSelectedChannel(channel);
                    setOpenChannelDialog(true);
                  }}
                  className="flex-1"
                >
                  Chi tiết
                </Button>

                <IconButton
                  size="sm"
                  color="green"
                  variant="outlined"
                  onClick={() => fetchLatestVideosData(channel.channelId)}
                  title="Fetch videos mới"
                >
                  <PlusIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Channel Detail Dialog */}
      <Dialog
        open={openChannelDialog}
        handler={() => setOpenChannelDialog(false)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <Typography variant="h5">Chi tiết Channel</Typography>
        </DialogHeader>
        
        <DialogBody>
          {selectedChannel && (
            <div className="space-y-6">
              {/* Channel Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Typography variant="h6" color="blue-gray">Tên Channel</Typography>
                    <Typography>{selectedChannel.title}</Typography>
                  </div>

                  <div>
                    <Typography variant="h6" color="blue-gray">Mô tả</Typography>
                    <Typography className="text-sm text-gray-600">
                      {selectedChannel.description || 'Không có mô tả'}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="h6" color="blue-gray">Category</Typography>
                    <Typography>
                      {selectedChannel.category?.name || 'Không có category'}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Typography variant="h6" color="blue-gray">Channel ID</Typography>
                    <Typography className="text-sm font-mono">{selectedChannel.channelId}</Typography>
                  </div>

                  <div>
                    <Typography variant="h6" color="blue-gray">Ngày tạo</Typography>
                    <Typography>{formatDate(selectedChannel.createdAt || selectedChannel.updatedAt)}</Typography>
                  </div>

                  <div>
                    <Typography variant="h6" color="blue-gray">Thumbnail</Typography>
                    {selectedChannel.imageThumbnail ? (
                      <img
                        src={selectedChannel.imageThumbnail}
                        alt="Channel thumbnail"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <Typography color="gray">Không có thumbnail</Typography>
                    )}
                  </div>
                </div>
              </div>

              {/* Channel Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h6" color="blue-gray">
                    Videos của Channel
                  </Typography>
                  <Button
                    size="sm"
                    color="green"
                    onClick={() => fetchChannelVideosData(selectedChannel.channelId)}
                    disabled={fetchingVideos}
                  >
                    {fetchingVideos ? <Spinner size="sm" /> : 'Tải Videos'}
                  </Button>
                </div>

                {channelVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channelVideos.map((video, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <PlayCircleIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <Typography variant="small" className="font-medium line-clamp-2">
                              {video.title}
                            </Typography>
                            <Typography variant="small" color="gray">
                              {formatDate(video.publishedAt)}
                            </Typography>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PlayCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Typography color="gray">
                      Chưa có video nào được tải
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={() => {
              if (selectedChannel) {
                subscribeToChannelData(selectedChannel.channelId);
              }
            }}
            className="mr-1"
          >
            Đăng ký nhận thông báo
          </Button>
          <Button
            variant="gradient"
            onClick={() => setOpenChannelDialog(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default YouTubeChannels; 