import React, { useState } from 'react';
import { fetchChannels, subscribeToChannel, handleAPIError } from './YouTubeAPI';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Spinner,
  Alert,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const YouTubeChannelsDemo = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [channelId, setChannelId] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  // Test fetch channels API
  const testFetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);
      
      const result = await fetchChannels(page, limit);
      setResponse(result);
    } catch (err) {
      console.error('Error:', err);
      setError(handleAPIError(err, 'Lỗi khi test API'));
    } finally {
      setLoading(false);
    }
  };

  // Test subscribe to channel API
  const testSubscribeChannel = async () => {
    if (!channelId.trim()) {
      setError('Vui lòng nhập Channel ID');
      return;
    }

    try {
      setSubscribing(true);
      setError(null);
      
      await subscribeToChannel(channelId);
      alert('Đăng ký thành công!');
    } catch (err) {
      console.error('Error:', err);
      setError(handleAPIError(err, 'Lỗi khi đăng ký channel'));
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Header */}
      <Card>
        <CardHeader variant="gradient" color="red" className="mb-8 p-6">
          <Typography variant="h3" color="white" className="flex items-center gap-2">
            <PlayCircleIcon className="h-8 w-8" />
            YouTube Channels API Demo
          </Typography>
          <Typography variant="paragraph" color="white" className="mt-2 opacity-80">
            Test và demo các API endpoints cho YouTube Channels
          </Typography>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Test Fetch Channels */}
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Test Fetch Channels API
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Page
                </Typography>
                <Input
                  type="number"
                  value={page}
                  onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className="flex-1">
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Limit
                </Typography>
                <Input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            
            <Button
              color="blue"
              onClick={testFetchChannels}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Spinner size="sm" /> : null}
              Test Fetch Channels
            </Button>

            <div className="mt-4">
              <Typography variant="small" color="blue-gray" className="mb-2">
                API Endpoint:
              </Typography>
              <Typography variant="small" className="font-mono bg-gray-100 p-2 rounded">
                GET /youtube/channels?page={page}&limit={limit}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Test Subscribe Channel */}
      <Card>
        <CardHeader variant="gradient" color="green" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Test Subscribe Channel API
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Channel ID
              </Typography>
              <Input
                type="text"
                placeholder="Nhập Channel ID (VD: UCxbCocCuSdmLdmLdmLdmLdm)"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
            
            <Button
              color="green"
              onClick={testSubscribeChannel}
              disabled={subscribing || !channelId.trim()}
              className="flex items-center gap-2"
            >
              {subscribing ? <Spinner size="sm" /> : null}
              Test Subscribe Channel
            </Button>

            <div className="mt-4">
              <Typography variant="small" color="blue-gray" className="mb-2">
                API Endpoint:
              </Typography>
              <Typography variant="small" className="font-mono bg-gray-100 p-2 rounded">
                POST /youtube/subscribe
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader variant="gradient" color="purple" className="mb-4 p-6">
            <Typography variant="h6" color="white" className="flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6" />
              API Response
            </Typography>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              {/* Response Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Typography variant="h4" color="blue">
                    {response.data?.length || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Channels returned
                  </Typography>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Typography variant="h4" color="green">
                    {response.total || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Total channels
                  </Typography>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Typography variant="h4" color="purple">
                    {response.page || 1}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Current page
                  </Typography>
                </div>
              </div>

              {/* Raw JSON Response */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Raw JSON Response:
                </Typography>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Channels List */}
              {response.data && response.data.length > 0 && (
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Channels Preview:
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {response.data.slice(0, 6).map((channel, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center gap-3">
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
                            <PlayCircleIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Typography variant="small" className="font-medium truncate">
                              {channel.title}
                            </Typography>
                            <Typography variant="small" color="gray" className="truncate">
                              {channel.channelId}
                            </Typography>
                            {channel.category && (
                              <Typography variant="small" color="blue" className="truncate">
                                {channel.category.name}
                              </Typography>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {response.data.length > 6 && (
                    <Typography variant="small" color="gray" className="text-center mt-4">
                      ... và {response.data.length - 6} channels khác
                    </Typography>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* API Documentation */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            API Documentation
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="space-y-4">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Base URL:
              </Typography>
              <Typography className="font-mono bg-gray-100 p-2 rounded">
                https://api-ndolv2.nongdanonline.cc
              </Typography>
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Available Endpoints:
              </Typography>
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <Typography className="font-mono text-sm">
                    GET /youtube/channels?page=1&limit=10
                  </Typography>
                  <Typography variant="small" color="gray">
                    Lấy danh sách channels với phân trang
                  </Typography>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <Typography className="font-mono text-sm">
                    POST /youtube/subscribe
                  </Typography>
                  <Typography variant="small" color="gray">
                    Đăng ký nhận thông báo từ channel
                  </Typography>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <Typography className="font-mono text-sm">
                    GET /youtube/categories
                  </Typography>
                  <Typography variant="small" color="gray">
                    Lấy danh sách categories
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default YouTubeChannelsDemo;
