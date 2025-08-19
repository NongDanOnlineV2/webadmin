import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Spinner,
} from '@material-tailwind/react';
import {
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { getCacheStats, clearCache } from './YouTubeAPI';

const YouTubePerformance = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const updateCacheStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
    setLastRefresh(new Date());
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      clearCache();
      updateCacheStats();
      alert('Cache đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa cache:', error);
      alert('Có lỗi xảy ra khi xóa cache');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCacheStats();
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader variant="gradient" color="blue" className="mb-4 p-4">
        <Typography variant="h5" color="white" className="flex items-center gap-2">
          <CpuChipIcon className="h-6 w-6" />
          Performance & Cache
        </Typography>
      </CardHeader>
      
      <CardBody className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cache Size */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CpuChipIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <Typography variant="h4" color="blue">
              {cacheStats?.size || 0}
            </Typography>
            <Typography variant="small" color="gray">
              Cache Entries
            </Typography>
          </div>

          {/* Cache Keys */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <ChartBarIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <Typography variant="h4" color="green">
              {cacheStats?.keys?.length || 0}
            </Typography>
            <Typography variant="small" color="gray">
              Active Keys
            </Typography>
          </div>

          {/* Last Refresh */}
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <Typography variant="h6" color="amber">
              {lastRefresh ? lastRefresh.toLocaleTimeString('vi-VN') : 'N/A'}
            </Typography>
            <Typography variant="small" color="gray">
              Last Refresh
            </Typography>
          </div>

          {/* Actions */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <ArrowPathIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <Button
              size="sm"
              color="purple"
              onClick={handleClearCache}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Spinner size="sm" /> : 'Clear Cache'}
            </Button>
          </div>
        </div>

        {/* Cache Details */}
        {cacheStats?.keys && cacheStats.keys.length > 0 && (
          <div className="mt-6">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Cache Keys:
            </Typography>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cacheStats.keys.map((key, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Chip
                    value={`${index + 1}`}
                    size="sm"
                    color="blue"
                    variant="ghost"
                  />
                  <Typography variant="small" className="font-mono text-xs">
                    {key}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Performance Tips:
          </Typography>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Cache được tự động xóa sau 5 phút</li>
            <li>• Retry logic tự động thử lại 3 lần khi gặp lỗi server</li>
            <li>• Cache được clear sau mỗi thao tác CRUD</li>
            <li>• API calls được tối ưu với caching</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default YouTubePerformance; 