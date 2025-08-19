import React, { useState, useEffect } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
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
  Textarea,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TagIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const YouTubeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: null
  });

  // Fetch tất cả categories
  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Lỗi khi fetch categories:', error);
      alert(handleAPIError(error, 'Lỗi khi tải danh sách categories'));
    } finally {
      setLoading(false);
    }
  };

  // Tạo category mới
  const createCategoryData = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        alert('Vui lòng nhập tên category');
        return;
      }

      // Log form data trước khi gửi
      console.log('Form data before sending:', {
        name: formData.name,
        description: formData.description,
        thumbnail: formData.thumbnail ? {
          name: formData.thumbnail.name,
          type: formData.thumbnail.type,
          size: formData.thumbnail.size
        } : null
      });

      await createCategory(formData);
      
      alert('Đã tạo category thành công!');
      setOpenCategoryDialog(false);
      resetForm();
      fetchCategoriesData();
    } catch (error) {
      console.error('Lỗi khi tạo category:', error.response?.data || error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo category');
    }
  };

  // Cập nhật category
  const updateCategoryData = async () => {
    try {
      await updateCategory(selectedCategory.id, formData);
      
      alert('Đã cập nhật category thành công!');
      setOpenCategoryDialog(false);
      resetForm();
      fetchCategoriesData();
    } catch (error) {
      console.error('Lỗi khi cập nhật category:', error);
      alert(handleAPIError(error, 'Có lỗi xảy ra khi cập nhật category'));
    }
  };

  // Xóa category
  const deleteCategoryData = async (categoryId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa category này?')) return;
    
    try {
      await deleteCategory(categoryId);
      alert('Đã xóa category thành công!');
      fetchCategoriesData();
    } catch (error) {
      console.error('Lỗi khi xóa category:', error);
      alert(handleAPIError(error, 'Có lỗi xảy ra khi xóa category'));
    }
  };

  // Lọc categories
  const filteredCategories = categories.filter(category => {
    return category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      thumbnail: null
    });
    setSelectedCategory(null);
    setIsEditing(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, thumbnail: file }));
  };

  // Open dialog for editing
  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      thumbnail: null
    });
    setIsEditing(true);
    setOpenCategoryDialog(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    resetForm();
    setIsEditing(false);
    setOpenCategoryDialog(true);
  };

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
            <TagIcon className="h-8 w-8" />
            Quản lý YouTube Categories
          </Typography>
          <Typography variant="paragraph" color="white" className="mt-2 opacity-80">
            Quản lý các danh mục video YouTube
          </Typography>
        </CardHeader>
      </Card>

      {/* Search và Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                containerProps={{ className: "min-w-[300px]" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Typography variant="small" color="gray" className="font-normal">
              Tổng: {filteredCategories.length} categories
            </Typography>
            <Button
              color="blue"
              size="sm"
              className="flex items-center gap-2"
              onClick={openCreateDialog}
            >
              <PlusIcon className="h-4 w-4" />
              Tạo Category Mới
            </Button>
          </div>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Category Thumbnail */}
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {category.imageThumbnail ? (
                  <img
                    src={`https://api-ndolv2.nongdanonline.cc${category.imageThumbnail}`}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <TagIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Category Info */}
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2 line-clamp-2">
                {category.name}
              </Typography>
              
              <Typography variant="small" color="gray" className="mb-3 line-clamp-3">
                {category.description || 'Không có mô tả'}
              </Typography>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(category.createdAt)}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <PlayCircleIcon className="h-4 w-4 text-red-500" />
                  <span>{category.videoCount || 0} videos</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <EyeIcon className="h-4 w-4 text-blue-500" />
                  <span>{category.channelCount || 0} channels</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => openEditDialog(category)}
                  className="flex-1"
                >
                  Chỉnh sửa
                </Button>
                
                <IconButton
                  size="sm"
                  color="red"
                  variant="outlined"
                  onClick={() => deleteCategoryData(category.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Category Dialog */}
      <Dialog
        open={openCategoryDialog}
        handler={() => setOpenCategoryDialog(false)}
        size="md"
      >
        <DialogHeader>
          <Typography variant="h5">
            {isEditing ? 'Chỉnh sửa Category' : 'Tạo Category Mới'}
          </Typography>
        </DialogHeader>
        
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Tên Category
              </Typography>
              <Input
                type="text"
                placeholder="Nhập tên category..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Mô tả
              </Typography>
              <Textarea
                placeholder="Nhập mô tả category..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Thumbnail
              </Typography>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                label="Chọn file thumbnail"
              />
            </div>
          </div>
        </DialogBody>
        
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenCategoryDialog(false)}
            className="mr-1"
          >
            Hủy
          </Button>
          <Button
            variant="gradient"
            onClick={isEditing ? updateCategoryData : createCategoryData}
            disabled={!formData.name.trim()}
          >
            {isEditing ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default YouTubeCategories; 