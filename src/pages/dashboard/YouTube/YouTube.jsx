import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
import { TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import YouTubeChannels from './YouTubeChannels';
import YouTubeCategories from './YouTubeCategories';

const YouTube = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const data = [
    {
      label: "Categories",
      value: "categories",
      icon: TagIcon,
      component: <YouTubeCategories />,
    },
    {
      label: "Channels",
      value: "channels",
      icon: UserGroupIcon,
      component: <YouTubeChannels />,
    },
  ];

  return (
    <div className="mt-12">
      <Card>
        <CardHeader
          color="gray"
          className="relative h-16 flex items-center"
        >
          <Typography variant="h6" color="white">
            YouTube Management
          </Typography>
        </CardHeader>
        <CardBody>
          <Tabs value={activeTab} className="overflow-visible">
            <TabsHeader className="relative z-0">
              {data.map(({ label, value, icon: Icon }) => (
                <Tab 
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody
              animate={{
                initial: { x: 250 },
                mount: { x: 0 },
                unmount: { x: 250 },
              }}
              className="!overflow-x-hidden"
            >
              {data.map(({ value, component }) => (
                <TabPanel key={value} value={value}>
                  {component}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default YouTube;
