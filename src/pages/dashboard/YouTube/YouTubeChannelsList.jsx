import React, { useState, useEffect } from 'react';
import {
  fetchChannels,
  fetchCategories,
  subscribeToChannel,
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
  Select,
  Option,
  Avatar,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const YouTubeChannelsList = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChannels, setTotalChannels] = useState(0);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  // Fetch channels với phân trang
  const fetchChannelsData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetchChannels(page, 10);
      
      if (response && response.data) {
        setChannels(response.data);
        setCurrentPage(page);
        // Tính toán pagination dựa trên response
        const total = response.total || response.data.length;
        setTotalChannels(total);
        setTotalPages(Math.ceil(total / 10));
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
    }
  };

  // Subscribe to channel
  const handleSubscribe = async (channelId) => {
    try {
      setSubscribing(true);
      await subscribeToChannel(channelId);
      alert('Đã đăng ký nhận thông báo từ channel thành công!');
    } catch (error) {
      console.error('Lỗi khi subscribe:', error);
      alert(handleAPIError(error, 'Có lỗi xảy ra khi đăng ký'));
    } finally {
      setSubscribing(false);
    }
  };

  // Lọc channels
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.channelId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || channel.category?.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchChannelsData(newPage);
    }
  };

  useEffect(() => {
    fetchChannelsData();
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
            <PlayCircleIcon className="h-8 w-8" />
            YouTube Channels
          </Typography>
          <Typography variant="paragraph" color="white" className="mt-2 opacity-80">
            Danh sách các kênh YouTube được theo dõi
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
              <IconButton
                size="sm"
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </IconButton>
              <IconButton
                size="sm"
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </IconButton>
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
                    src={channel.imageThumbnail}
                    alt={channel.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{display: channel.imageThumbnail ? 'none' : 'flex'}}>
                  <UserGroupIcon className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              
              {/* Category Badge */}
              {channel.category && (
                <div className="absolute top-2 right-2">
                  <Chip
                    value={channel.category.name}
                    color="blue"
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Channel Info */}
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2 line-clamp-2">
                {channel.title}
              </Typography>
              
              <Typography variant="small" color="gray" className="mb-3 line-clamp-3">
                {channel.description || 'Không có mô tả'}
              </Typography>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(channel.createdAt || channel.updatedAt)}</span>
              </div>

              {/* Channel ID */}
              <div className="mb-4">
                <Typography variant="small" color="gray" className="font-mono text-xs">
                  ID: {channel.channelId}
                </Typography>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setSelectedChannel(channel);
                    setOpenDetailDialog(true);
                  }}
                  className="flex-1"
                >
                  Chi tiết
                </Button>
                
                <Button
                  size="sm"
                  color="red"
                  variant="gradient"
                  onClick={() => handleSubscribe(channel.channelId)}
                  disabled={subscribing}
                  className="flex-1"
                >
                  {subscribing ? <Spinner size="sm" /> : 'Đăng ký'}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredChannels.length === 0 && !loading && (
        <Card className="p-12">
          <div className="text-center">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" color="gray" className="mb-2">
              Không tìm thấy channel nào
            </Typography>
            <Typography color="gray">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </Typography>
          </div>
        </Card>
      )}

      {/* Channel Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        handler={() => setOpenDetailDialog(false)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <Typography variant="h5">Chi tiết Channel</Typography>
        </DialogHeader>
        
        <DialogBody>
          {selectedChannel && (
            <div className="space-y-6">
              {/* Channel Thumbnail */}
              {selectedChannel.imageThumbnail && (
                <div className="text-center">
                  <img 
                    src={selectedChannel.imageThumbnail} 
                    alt="Channel thumbnail"
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                </div>
              )}

              {/* Channel Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Typography variant="h6" color="blue-gray">Tên Channel</Typography>
                    <Typography>{selectedChannel.title}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" color="blue-gray">Channel ID</Typography>
                    <Typography className="text-sm font-mono">{selectedChannel.channelId}</Typography>
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
                    <Typography variant="h6" color="blue-gray">Ngày tạo</Typography>
                    <Typography>{formatDate(selectedChannel.createdAt || selectedChannel.updatedAt)}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" color="blue-gray">Mô tả</Typography>
                    <Typography className="text-sm text-gray-600">
                      {selectedChannel.description || 'Không có mô tả'}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              if (selectedChannel) {
                handleSubscribe(selectedChannel.channelId);
              }
            }}
            className="mr-1"
            disabled={subscribing}
          >
            {subscribing ? <Spinner size="sm" /> : 'Đăng ký nhận thông báo'}
          </Button>
          <Button
            variant="gradient"
            onClick={() => setOpenDetailDialog(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default YouTubeChannelsList;
