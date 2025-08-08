import React, { useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { setToken, useMaterialTailwindController, setAuthStatus } from "./context";
import { Dashboard, Auth, Public } from "@/layouts";
import VideoFarmById from "./pages/dashboard/VideoFarms/VideoById";
import VideoLikeList from "./pages/dashboard/VideoFarms/VideoLikeList";
import PostDetail from "./pages/dashboard/post/PostDetail";
import CommentPostbyIdPost from "./pages/dashboard/AdminCommentPost/CommentPostbyIdPost";
import FarmDetail from "./pages/dashboard/farm/FarmDetail";
import { Farms } from "./pages/dashboard/farm/farms";
import UserDetail from "./pages/dashboard/user/UserDetail";
import VideoById from "./pages/dashboard/VideoFarms/VideoById";
import ChinhSachBaoMat from "./pages/dashboard/ChinhSachBaoMat";
import ChinhSachCookie from "./pages/dashboard/ChinhSachCookie";
import DieuKhoanDieuKien from "./pages/dashboard/DieuKhoanDieuKien";
import ChinhSachTaoTrang from "./pages/dashboard/ChinhSachTaoTrang";
import ChinhSachCongDong from "./pages/dashboard/ChinhSachCongDong";
import ResetPassword from "@/pages/auth/ResetPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ChinhSachTreEm from "./pages/dashboard/ChinhSachBVTreEm";
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [controller, dispatch] = useMaterialTailwindController();
  const { isAuthenticated, token: contextToken } = controller;

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const skipRedirect = params.get("success") === "true";

  const isResetPasswordWithToken = location.pathname.startsWith("/reset-password") && params.get("token");
  const isVerifyOtp = location.pathname === "/verify-otp";
  const token = localStorage.getItem("token");


  const publicAuthPaths = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/verify-otp",
    "/reset-password",
  ];

  const isPublicPath = publicAuthPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const isChinhSach = location.pathname.startsWith("/chinh-sach");

  if (!token && !isPublicPath && !isChinhSach && !skipRedirect && !isResetPasswordWithToken && !isVerifyOtp) {
    navigate("/auth/sign-in");
  }

    if (token && !contextToken) {
    setAuthStatus(dispatch, true);
    setToken(dispatch, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const handleUnload = () => {
    if (performance.getEntriesByType("navigation")[0].type !== "reload") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("apiBaseUrl");
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [navigate, location, dispatch, contextToken]);


  return (
    <Routes>
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route path="VideoFarmById/:farmId" element={<VideoFarmById />} />
        <Route path="video-like/:videoId" element={<VideoLikeList />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="CommentPostbyIdPost/:postId" element={<CommentPostbyIdPost />} />
        <Route path="VideoFarms/VideoById/:id" element={<VideoById />} />
        <Route path="users/:id" element={<UserDetail />} />
      </Route>

      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/admin/Farms" element={<Farms />} />
      <Route path="/admin/farms/:id" element={<FarmDetail />} />

      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

      <Route path="/chinh-sach/*" element={<Public />}>
        <Route path="bao-mat" element={<ChinhSachBaoMat />} />
        <Route path="cookie" element={<ChinhSachCookie />} />
        <Route path="dieu-khoan" element={<DieuKhoanDieuKien />} />
        <Route path="tao-trang" element={<ChinhSachTaoTrang />} />
        <Route path="cong-dong" element={<ChinhSachCongDong />} />
        <Route path="tre-em" element={<ChinhSachTreEm />} />
      </Route>
    </Routes>
  );
}

export default App;
