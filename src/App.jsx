import React, {useEffect} from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !window.location.pathname.startsWith("/chinh-sach") && !window.location.pathname.startsWith("/auth")) {
      navigate("/auth/sign-in");
    }

    const handleUnload = () => {
      if (performance.getEntriesByType("navigation")[0].type !== "reload") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("apiBaseUrl");
    }
    };

    window.addEventListener("beforeunload", handleUnload);


    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    }
  }, [navigate]);

  return (
 <Routes>
      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route path="VideoFarmById/:farmId" element={<VideoFarmById />} />
        <Route path="video-like/:videoId" element={<VideoLikeList />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="CommentPostbyIdPost/:postId" element={<CommentPostbyIdPost />} />
        <Route path="VideoFarms/VideoById/:id" element={<VideoById />} />
     <Route path="users/:id" element={<UserDetail />} />
      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/admin/Farms" element={<Farms />} />
      <Route path="/admin/farms/:id" element={<FarmDetail />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/chinh-sach/*" element={<Public />}>
        <Route path="bao-mat" element={<ChinhSachBaoMat />} />
        <Route path="cookie" element={<ChinhSachCookie />} />
        <Route path="dieu-khoan" element={<DieuKhoanDieuKien />} />
      </Route>
    </Routes>
  );
}

export default App;