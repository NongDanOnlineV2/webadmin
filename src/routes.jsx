import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  NewspaperIcon,
  ReceiptPercentIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/solid";
import VideoLikeList from "@/pages/dashboard/VideoFarms/VideoLikeList";
import { Home, Users, Farms, Questions, AnswersTable, ListVideo, PostList, AdminReports,CommentPost  } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { ViewfinderCircleIcon,VideoCameraIcon,ChatBubbleOvalLeftEllipsisIcon  } from "@heroicons/react/24/outline";
import { Comment } from "react-loader-spinner";
import FarmDetail from "@/pages/dashboard/farm/FarmDetail";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        path: "/Users",
        element: <Users />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Farms",
        path: "/Farms",
        element: <Farms />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Questions",
        path: "/Questions",
        element: <Questions />,
      },
      {

        icon: <ChatBubbleLeftEllipsisIcon {...icon} />,
        name: "AnswersTable",
        path: "/AnswersTable",
        element: <AnswersTable />,
      },
        {
        icon: <VideoCameraIcon {...icon} />,
        name: "ListVideo",
        path: "/ListVideo",
        element: <ListVideo />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "PostList",
        path: "/PostList",
        element: <PostList />,
      },
      {
      icon: <NewspaperIcon className="h-5 w-5" />,
      name: "chinhsach",
      path: "/chinhsach",
      children: [
        {
          name: "Bảo mật",
          path: "/chinh_sach_bao-mat",
        },
        {
          name: "Cookie",
          path: "/chinh_sach_cookie",
        },
        {
          name: "Điều khoản",
          path: "/chinh_sach_dieu_khoan",
        },
      ],
    }
    ,
      
    {
        icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
        name: "CommentPost",
        path: "/CommentPost",
         element: <CommentPost />,

      }, 
      
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
