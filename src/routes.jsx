import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  NewspaperIcon,
  ReceiptPercentIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/solid";

import VideoLikeList from "@/pages/dashboard/VideoFarms/VideoLikeList";
import { Home, Users, Farms, Questions, AnswersTable, ListVideo, PostList, AdminReports,CommentPost  } from "@/pages/dashboard";
import { SignIn, SignUp} from "@/pages/auth";
import ChinhSach from "@/pages/dashboard/ChinhSach";
import ChinhSachBaoMat from "@/pages/dashboard/ChinhSachBaoMat";
import ChinhSachCookie from "@/pages/dashboard/ChinhSachCookie";
import DieuKhoanDieuKien from "@/pages/dashboard/DieuKhoanDieuKien";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
        icon: <ReceiptPercentIcon {...icon} />,
        name: "AdminReports",
        path: "/AdminReports",
        element: <AdminReports />,
      },
    {
        icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
        name: "CommentPost",
        path: "/CommentPost",
         element: <CommentPost />,

      }, 
{
  icon: <ShieldCheckIcon {...icon} />,
  name: "CHÍNH SÁCH",
  collapse: [
    { name: "CHÍNH SÁCH BẢO MẬT", path: "/chinh-sach/bao-mat", element: <ChinhSachBaoMat /> },
    { name: "CHÍNH SÁCH COOKIE", path: "/chinh-sach/cookie", element: <ChinhSachCookie /> },
    { name: "ĐIỀU KHOẢN & ĐIỀU KIỆN", path: "/chinh-sach/dieu-khoan", element: <DieuKhoanDieuKien /> },
  ],
}
      
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "sign-in",
        element: <SignIn />,
      },
       {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "reset-password/:token",
      element: <ResetPassword />,
    },
    ],
  },
];

export default routes;
