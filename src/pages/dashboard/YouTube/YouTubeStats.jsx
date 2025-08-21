import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react';
import {
  PlayCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const YouTubeStats = ({ stats }) => {
  const statCards = [
    {
      title: "Tổng Video",
      value: stats.totalVideos || 0,
      icon: PlayCircleIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Video Đã Duyệt",
      value: stats.approvedVideos || 0,
      icon: HeartIcon,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Video Chờ Duyệt",
      value: stats.pendingVideos || 0,
      icon: ClockIcon,
      color: "amber",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      title: "Tổng Lượt Thích",
      value: stats.totalLikes || 0,
      icon: HeartIcon,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Tổng Bình Luận",
      value: stats.totalComments || 0,
      icon: ChatBubbleLeftIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Tổng Lượt Xem",
      value: stats.totalViews || 0,
      icon: EyeIcon,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Người Dùng Đăng Video",
      value: stats.uniqueUsers || 0,
      icon: UserGroupIcon,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Tỷ Lệ Duyệt",
      value: `${stats.approvalRate || 0}%`,
      icon: PlayCircleIcon,
      color: "teal",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  {stat.value}
                </Typography>
                <Typography variant="paragraph" color="gray" className="font-normal">
                  {stat.title}
                </Typography>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default YouTubeStats; 