import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Spinner, Collapse, Dialog, DialogBody, DialogFooter, DialogHeader, Button, Chip,
  Avatar, Input
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import PostLikeUserDialog from "./listpostlikeUser"
import { BaseUrl } from "@/ipconfig";
export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFarms, setOpenFarms] = useState(false);
  const [openVideos, setOpenVideos] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const [videoLikes, setVideoLikes] = useState({}); 
  const [videoComments, setVideoComments] = useState({});
  const [selectedVideoLikes, setSelectedVideoLikes] = useState([]);
  const [selectedVideoComments, setSelectedVideoComments] = useState([]);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);        
  const [selectedFarmVideos, setSelectedFarmVideos] = useState([]);     
  const [selectedFarmName, setSelectedFarmName] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [openPostLikesDialog, setOpenPostLikesDialog] = useState(false);
  const [selectedPostTitle, setSelectedPostTitle] = useState("");
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [openPostCommentDialog, setOpenPostCommentDialog] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [openAddress, setOpenAddress] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [videoLikesCache, setVideoLikesCache] = useState({});
  const [loadingFarms,setLoadingFarms] = useState(false)
  const [videoCommentsCache, setVideoCommentsCache] = useState({});
  const [postLikesCache, setPostLikesCache] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);  
  const [visibleFarms, setVisibleFarms] = useState(6);
  const [visibleVideos, setVisibleVideos] = useState(6);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [videoCountsByFarm, setVideoCountsByFarm] = useState({});
  const [pageFarms, setPageFarms] = useState(1);
  const [pageVideos, setPageVideos] = useState(1);
  const [pagePosts, setPagePosts] = useState(1);
  const [hasMoreFarms, setHasMoreFarms] = useState(true);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [addressForm, setAddressForm] = useState({
    addressName: "",
    address: "",
    ward: "",
    province: ""
  });

  const fetchPaginatedData = async (url, config) => {
    let allData = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await axios.get(`${url}?page=${page}&limit=50`, config);
      const pageData = res.data?.data || [];
      allData = [...allData, ...pageData];

      hasMore = pageData.length > 0 && pageData.length === 50;
      page++;
    }

    return allData;
  };

  const handleShowMoreFarms = () => {
    setVisibleFarms((prev) => prev + 6);
  };

  const handleShowMoreVideos = () => {
    setVisibleVideos((prev) => prev + 6);
  };

  const handleShowMorePosts = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  const fetchPostCommentsUsers = async (postId, postTitle) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/admin-comment-post/post/${postId}`,
      config
    );
    setSelectedPostComments(res.data.comments || []);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn(`Post ${postId} không có comment.`);
      setSelectedPostComments([]); 
    } else {
      console.error(`Lỗi khi lấy comment cho post ${postId}:`, err);
      setSelectedPostComments([]);
    }
  } finally {
    setSelectedPostTitle(postTitle);
    setOpenPostCommentDialog(true); 
  }
};

const fetchCommentCount = async (postId) => {
  const token = localStorage.getItem("token");
  const config = { 
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: (status) => status >= 200 && status < 500,
  };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/admin-comment-post/post/${postId}`,
      config
    );

    if (res.status === 404) {
      console.warn(`Post ${postId} không có comment.`);
      return 0;
    }

    return res.data.comments?.length || 0;
  } catch (err) {
    console.error(`Lỗi khi lấy comment cho post ${postId}:`, err);
    return 0;
  }
};

const fetchLikeCount = async (postId) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/post-feed/${postId}/likes`,
      config
    );
    return res.data?.total || 0;
  } catch (err) {
    console.error(`Lỗi khi lấy like cho post ${postId}:`, err);
    return 0;
  }
};

const handleOpenEditAddress = (addr) => {
  setEditingAddress(addr);
  setAddressForm({
    addressName: addr.addressName || "",
    address: addr.address || "",
    ward: addr.ward || "",
    province: addr.province || ""
  });
  setEditAddressOpen(true);
};

const handleUpdateAddress = async () => {
  if (!editingAddress || !editingAddress._id) {
    console.error("Không tìm thấy ID địa chỉ để cập nhật", editingAddress);
    alert("Không thể cập nhật địa chỉ vì thiếu ID.");
    return;
  }

  const token = localStorage.getItem("token");
  const payload = {
    ...addressForm,
    userId: user?.id,
  };

  try {
    await axios.put(
      `https://api-ndolv2.nongdanonline.cc/admin/user-address/${editingAddress._id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Cập nhật địa chỉ thành công!");

    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/admin/user-address/user/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAddresses(res.data || []);
    setEditAddressOpen(false);
  } catch (err) {
    console.error("Lỗi khi cập nhật địa chỉ:", err.response?.data || err.message);
    alert("Cập nhật địa chỉ thất bại!");
  }
};

const handleDeleteAddress = async (addressId) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá địa chỉ này?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(
      `https://api-ndolv2.nongdanonline.cc/admin/user-address/${addressId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Xoá địa chỉ thành công!");

    // Cập nhật lại danh sách địa chỉ
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/admin/user-address/user/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAddresses(res.data || []);
  } catch (err) {
    console.error("Lỗi khi xoá địa chỉ:", err.response?.data || err.message);
    alert("Xoá địa chỉ thất bại!");
  }
};

const fetchPostLikesUsers = async (postId, postTitle) => {
  if (postLikesCache[postId]) {
    setSelectedPostTitle(postTitle);
    setSelectedPostLikes(postLikesCache[postId]);
    setOpenPostLikesDialog(true);
    return;
  }

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/post-feed/${postId}/likes`,
      config
    );
    const users = res.data?.users || [];
    setPostLikesCache((prev) => ({
      ...prev,
      [postId]: users,
    }));

    setSelectedPostTitle(postTitle);
    setSelectedPostLikes(users);
    setOpenPostLikesDialog(true);
  } catch (err) {
    console.error(`Error fetching likes for post ${postId}:`, err);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [userRes, addressRes ] = await Promise.all([
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, config), 
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin/user-address/user/${id}`, config), 
        ]);

        setUser(userRes.data);
        setAddresses(addressRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

const handleOpenFarms = async () => {
  if (openFarms) {
    setOpenFarms(false); 
    return;
  }
  setOpenFarms(true); 
  if (farms.length === 0 && !loadingFarms) {
    setLoadingFarms(true); 
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const allFarms = await fetchPaginatedData(`${BaseUrl}/adminfarms`, config);
      setFarms(allFarms); 
      const allVideos = await fetchPaginatedData(`${BaseUrl}/admin-video-farm`, config);

      const counts = {};
      allVideos.forEach((video) => {
        const farmId = video.farmId?._id; 
        if (farmId) {
          counts[farmId] = (counts[farmId] || 0) + 1;
        }
      });
      setVideoCountsByFarm(counts);
      setVideos(allVideos);
      const statsPromises = allVideos.map((video) => fetchVideoStats(video._id));
      await Promise.allSettled(statsPromises);
    } catch (err) {
      console.error("Lỗi khi fetch farms:", err);
    } finally {
      if (openFarms) setLoadingFarms(false); 
    }
  }
};

const handleOpenPosts = async () => {
  if (openPosts) {
    setOpenPosts(false); 
    return;
  }
  setOpenPosts(true); 
  if (posts.length === 0 && !loadingPosts) {
    setLoadingPosts(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const allPosts = await fetchPaginatedData(`${BaseUrl}/admin-post-feed`, config);
      setPosts(allPosts); 

      const statsPromises = allPosts.map(async (post) => {
        const [likeCount, commentCount] = await Promise.all([
          fetchLikeCount(post.id),
          fetchCommentCount(post.id),
        ]);

        setLikeCounts((prev) => ({
          ...prev,
          [post.id]: likeCount,
        }));

        setCommentCounts((prev) => ({
          ...prev,
          [post.id]: commentCount,
        }));
      });

      await Promise.allSettled(statsPromises); 
    } catch (err) {
      console.error("Lỗi khi load posts:", err);
    } finally {
      if (openPosts) setLoadingPosts(false); 
    }
  }
};

const handleOpenVideos = async () => {
  if (openVideos) {
    setOpenVideos(false); 
    return;
  }
  setOpenVideos(true); 
  if (videos.length === 0 && !loadingVideos) {
    setLoadingVideos(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const allVideos = await fetchPaginatedData(`${BaseUrl}/admin-video-farm`, config);

      setVideos(allVideos);

      const statsPromises = allVideos.map((video) => fetchVideoStats(video._id));
      await Promise.allSettled(statsPromises);
    } catch (err) {
      console.error("Lỗi khi load videos:", err);
    } finally {
      if (openVideos) setLoadingVideos(false); 
    }
  }
};

const fetchVideoLikesUsers = async (videoId, videoTitle) => {
  if (videoLikesCache[videoId]) {
    setSelectedVideoTitle(videoTitle);
    setSelectedVideoLikes(videoLikesCache[videoId]);
    setOpenLikesDialog(true);
    return;
  }

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/video-like/${videoId}/users`,
      config
    );
    setVideoLikesCache((prev) => ({
      ...prev,
      [videoId]: res.data?.users || [],
    }));
    setSelectedVideoTitle(videoTitle);
    setSelectedVideoLikes(res.data?.users || []);
    setOpenLikesDialog(true);
  } catch (err) {
    console.error(`Error fetching likes for video ${videoId}:`, err);
  }
};

const fetchVideoCommentsUsers = async (videoId, videoTitle) => {
  if (videoCommentsCache[videoId]) {
    setSelectedVideoTitle(videoTitle);
    setSelectedVideoComments(videoCommentsCache[videoId]);
    setOpenCommentsDialog(true);
    return;
  }

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await axios.get(
      `https://api-ndolv2.nongdanonline.cc/video-comment/${videoId}/comments`,
      config
    );
    setVideoCommentsCache((prev) => ({
      ...prev,
      [videoId]: res.data || [],
    }));
    setSelectedVideoTitle(videoTitle);
    setSelectedVideoComments(res.data || []);
    setOpenCommentsDialog(true);
  } catch (err) {
    console.error(`Error fetching comments for video ${videoId}:`, err);
  }
};

  const fetchVideoStats = async (videoId) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const [likeRes, commentRes] = await Promise.all([
      axios.get(`https://api-ndolv2.nongdanonline.cc/video-like/${videoId}/users`, config),
      axios.get(`https://api-ndolv2.nongdanonline.cc/video-comment/${videoId}/comments`, config),
    ]);

    setVideoLikes((prev) => ({
      ...prev,
      [videoId]: likeRes.data?.total || 0,
    }));
    setVideoComments((prev) => ({
      ...prev,
      [videoId]: Array.isArray(commentRes.data) ? commentRes.data.length : 0,
    }));
  } catch (err) {
    console.error(`Error fetching stats for video ${videoId}:`, err);
  }
};

  const showFarmVideos = async (farmId, farmName) => {           
    const relatedVideos = videos.filter((v) => v.farmId?.id === farmId);
    setSelectedFarmVideos(relatedVideos);
    setSelectedFarmName(farmName);
    setOpenVideoDialog(true);

  };
  const countVideosByFarm = (farmId) => {
  return videos.filter((v) => v.farmId?.id === farmId).length;
};

  const userFarms = farms.filter((f) => String(f.ownerId) === String(user?.id) || String(f.createBy) === String(user?.id));
  const userPosts = posts.filter(p => p.authorId?.id === user?.id);
  const userVideos = videos.filter(v => v.uploadedBy?.id === user?.id);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
  }

  if (!user) {
    return <Typography color="red">Không tìm thấy user.</Typography>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Thông tin user */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={`https://api-ndolv2.nongdanonline.cc${user.avatar}`}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">ID:</Typography>
              <Typography className="text-gray-900">{user.id}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Name:</Typography>
              <Typography className="text-gray-900">{user.fullName}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Email:</Typography>
              <Typography className="text-gray-900">{user.email}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Phone:</Typography>
              <Typography className="text-gray-900">{user.phone}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Role:</Typography>
              <Typography className="capitalize text-gray-900">{user.role}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Status:</Typography>
              <Typography
                className={`font-semibold ${
                  user.isActive
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Ngày tạo:</Typography>
              <Typography className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Ngày Updated gần nhất:</Typography>
              <Typography className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</Typography>
            </div>
          </div>
        </div>

      </Card>

      <Card>
  <div
    onClick={() => setOpenAddress(!openAddress)}
    className="cursor-pointer flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-md shadow"
  >
    <Typography variant="h5">
      Địa chỉ người dùng
    </Typography>
    <Typography
      variant="h5"
      className={`transform transition-transform duration-300 ${
        openAddress ? "rotate-180" : ""
      }`}
    >
      ▼
    </Typography>
  </div>

  <Collapse open={openAddress}>
    {openAddress && (
      <div className="overflow-hidden transition-all duration-300">
        <CardBody>
          {addresses.length === 0 ? (
            <Typography>Chưa có địa chỉ nào.</Typography>
          ) : (
            <div
              className={`grid gap-4 ${
                addresses.length === 1
                  ? "grid-cols-1"
                  : addresses.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {addresses.map((addr, index) => (
                <div
                  key={addr.id || index}
                  className="border p-4 rounded shadow space-y-1 bg-white"
                >
                  <Typography className="text-green-700 font-semibold">
                    {addr.addressName}
                  </Typography>
                  <Typography>
                    <b>Địa chỉ:</b> {addr.address}
                  </Typography>
                  <Typography>
                    <b>Phường/Xã:</b> {addr.ward}
                  </Typography>
                  <Typography>
                    <b>Tỉnh/TP:</b> {addr.province}
                  </Typography>
                  <Typography className="text-gray-500 text-sm mt-1">
                    <b>Tạo lúc:</b>{" "}
                    {new Date(addr.createdAt).toLocaleString()}
                  </Typography>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={() => handleOpenEditAddress(addr)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="red"
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </div>
    )}
  </Collapse>
</Card>

    <Dialog open={editAddressOpen} handler={setEditAddressOpen} size="sm">
      <DialogHeader>Chỉnh sửa địa chỉ</DialogHeader>
      <DialogBody className="space-y-4">
        <Input
          label="Tên địa chỉ"
          value={addressForm.addressName}
          onChange={(e) =>
            setAddressForm({ ...addressForm, addressName: e.target.value })
          }
        />
        <Input
          label="Địa chỉ"
          value={addressForm.address}
          onChange={(e) =>
            setAddressForm({ ...addressForm, address: e.target.value })
          }
        />
        <Input
          label="Phường/Xã"
          value={addressForm.ward}
          onChange={(e) =>
            setAddressForm({ ...addressForm, ward: e.target.value })
          }
        />
        <Input
          label="Tỉnh/TP"
          value={addressForm.province}
          onChange={(e) =>
            setAddressForm({ ...addressForm, province: e.target.value })
          }
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setEditAddressOpen(false)}>
          Huỷ
        </Button>
        <Button variant="gradient" onClick={handleUpdateAddress}>
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>

      {/* Thông tin Farms của user */}
      <Card>
  <div
    onClick={() => handleOpenFarms(!openFarms)}
    className="cursor-pointer flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-md shadow"
  >
    <Typography variant="h5">
      Danh sách Farms 
    </Typography>
    <Typography
      variant="h5"
      className={`transform transition-transform duration-300 ${
        openFarms ? "rotate-180" : ""
      }`}
    >
      ▼
    </Typography>
  </div>

  <Collapse open={openFarms}>
    {openFarms && (
      <div className="overflow-hidden transition-all duration-300">
        <CardBody>
          {userFarms.length === 0 ? (
            <Typography>Chưa có Farm nào.</Typography>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {userFarms.slice(0, visibleFarms).map((farm) => (
                <div
                  key={farm._id}
                  className="border p-4 rounded shadow space-y-2 bg-white"
                >
                  <Typography
                    variant="h6"
                    className="text-blue-600 font-semibold"
                  >
                    {farm.name}
                  </Typography>

                  <div className="space-y-1">
                    <Typography>
                      <b>Mã nông trại:</b> {farm.code}
                    </Typography>
                    <Typography>
                      <b>Tags:</b>{" "}
                      {(farm.tags || []).join(", ") || "—"}
                    </Typography>
                    <Typography>
                      <b>Trạng thái:</b>{" "}
                      {farm.status === "pending"
                        ? "Chờ duyệt"
                        : farm.status === "active"
                        ? "Đang hoạt động"
                        : "Đã khóa"}
                    </Typography>
                    <Typography>
                      <b>Tỉnh/Thành phố:</b> {farm.province}
                    </Typography>
                    <Typography>
                      <b>Quận/Huyện:</b> {farm.district}
                    </Typography>
                    <Typography>
                      <b>Phường/Xã:</b> {farm.ward}
                    </Typography>
                    <Typography>
                      <b>Đường:</b> {farm.street}
                    </Typography>
                    <Typography>
                      <b>Vị trí tổng quát:</b> {farm.location}
                    </Typography>
                    <Typography>
                      <b>Tổng diện tích (m²):</b> {farm.area}
                    </Typography>
                    <Typography>
                      <b>Đất canh tác (m²):</b> {farm.cultivatedArea}
                    </Typography>
                    <Typography>
                      <b>Dịch vụ:</b>{" "}
                      {(farm.services || []).join(", ") || "—"}
                    </Typography>
                    <Typography>
                      <b>Tính năng:</b>{" "}
                      {(farm.features || []).join(", ") || "—"}
                    </Typography>
                    {farm.ownerInfo && (
                      <>
                        <Typography>
                          <b>Chủ sở hữu:</b> {farm.ownerInfo.name}
                        </Typography>
                        <Typography>
                          <b>Số điện thoại:</b>{" "}
                          {farm.ownerInfo.phone}
                        </Typography>
                        <Typography>
                          <b>Email:</b> {farm.ownerInfo.email}
                        </Typography>
                      </>
                    )}
                    {farm.description && (
                      <div>
                        <Typography>
                          <b>Mô tả:</b>
                        </Typography>
                        <Typography className="italic text-gray-700">
                          {farm.description}
                        </Typography>
                      </div>
                    )}
                  </div>

                  {/* Số lượng video và nút xem chi tiết */}
                  <div className="flex gap-3 items-center mt-2">
                    <Typography color="deep-purple">
                      <b>Số lượng video:</b>{" "}
                      {countVideosByFarm(farm._id)}
                    </Typography>
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() =>
                        showFarmVideos(farm._id, farm.name)
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </div>

                  {/* Hình ảnh */}
                  {farm.pictures?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {farm.pictures.map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://api-ndolv2.nongdanonline.cc${
                            img.url || img.path || img.image
                          }`}
                          alt={`Hình ${idx + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {visibleFarms < userFarms.length && (
            <div className="flex justify-center mt-4">
              <Button
                color="blue"
                variant="outlined"
                onClick={handleShowMoreFarms}
              >
                Xem thêm Farms
              </Button>
            </div>
          )}
        </CardBody>
      </div>
    )}
  </Collapse>
</Card>

      {/* Danh sách video */}
      <Card>
  <div
    onClick={handleOpenVideos}
    className="cursor-pointer flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-md shadow"
  >
    <Typography variant="h5" className="text-gray-800 font-bold">
      Danh sách Videos 
    </Typography>
    <Typography
      variant="h5"
      className={`transform transition-transform duration-300 ${
        openVideos ? "rotate-180" : ""
      }`}
    >
      ▼
    </Typography>
  </div>

  <Collapse open={openVideos}>
    {openVideos && (
      <div className="overflow-hidden transition-all duration-300">
        <CardBody className="bg-white rounded-b-md">
          {userVideos.length === 0 ? (
            <Typography className="text-center text-gray-500 py-6">
              Chưa có video nào.
            </Typography>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userVideos.slice(0, visibleVideos).map((video) => (
                <div
                  key={video._id}
                  className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                >
                  {/* Tiêu đề */}
                  <Typography
                    variant="h6"
                    className="text-lg font-bold text-indigo-900 mb-2"
                  >
                    {video.title}
                  </Typography>

                  {/* Thuộc farm */}
                  <Typography className="mb-2 text-sm text-gray-700">
                    <strong>Thuộc Farm:</strong>{" "}
                    {video.farmId?.name || (
                      <span className="text-red-500">
                        Không thuộc farm nào
                      </span>
                    )}
                  </Typography>

                  {/* Video Player */}
                  {video.status === "pending" && video.localFilePath ? (
                    <video
                      src={
                        video.localFilePath.startsWith("http")
                          ? video.localFilePath
                          : `https://api-ndolv2.nongdanonline.cc${video.localFilePath}`
                      }
                      controls
                      className="h-[180px] w-full rounded shadow mb-3 object-cover"
                    />
                  ) : video.youtubeLink &&
                    video.status === "uploaded" ? (
                    video.youtubeLink.endsWith(".mp4") ? (
                      <video
                        src={video.youtubeLink}
                        controls
                        className="h-[180px] w-full rounded shadow mb-3 object-cover"
                      />
                    ) : (
                      <iframe
                        src={
                          "https://www.youtube.com/embed/" +
                          (video.youtubeLink.match(
                            /(?:v=|\/embed\/|\.be\/)([^\s&?]+)/
                          )?.[1] || "")
                        }
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-[180px] w-full rounded shadow mb-3"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-red-500 font-semibold bg-gray-100 rounded shadow mb-3">
                      Video không tồn tại
                    </div>
                  )}

                  {/* Thông tin video */}
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Danh sách phát:</strong>{" "}
                      {video.playlistName || "Không có"}
                    </p>
                    <p>
                      <strong>Ngày đăng:</strong>{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Người đăng:</strong>{" "}
                      {video.uploadedBy?.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {video.uploadedBy?.email}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong> {video.status}
                    </p>
                  </div>

                  {/* Lượt thích & Lượt bình luận */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div
                      onClick={() =>
                        fetchVideoLikesUsers(video._id, video.title)
                      }
                      className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium text-xs cursor-pointer shadow hover:bg-red-100 transition"
                    >
                      ❤️ Lượt thích: {videoLikes[video._id] ?? "…"}
                    </div>
                    <div
                      onClick={() =>
                        fetchVideoCommentsUsers(video._id, video.title)
                      }
                      className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-xs cursor-pointer shadow hover:bg-blue-100 transition"
                    >
                      💬 Bình luận: {videoComments[video._id] ?? "…"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
                  {visibleVideos < userVideos.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleShowMoreVideos} color="blue" variant="outlined">
              Xem thêm videos
            </Button>
          </div>
        )}
        </CardBody>
      </div>
    )}
  </Collapse>
</Card>

      <Dialog
  open={openVideoDialog}
  size={selectedFarmVideos.length === 1 ? "md" : "xl"} 
  dismiss={{ outsidePress: false }}
>
  <DialogHeader>Danh sách video - {selectedFarmName}</DialogHeader>

  <DialogBody className="space-y-6 max-h-[560px] overflow-y-auto">
    {selectedFarmVideos.length === 0 ? (
      <Typography>Không có video nào cho farm này.</Typography>
    ) : (
      <div
        className={`grid gap-4 ${
          selectedFarmVideos.length === 1
            ? "grid-cols-1" 
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" 
        }`}
      >
        {selectedFarmVideos.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow p-4 border flex flex-col"
          >
            <Typography
              variant="h6"
              className="mb-2 font-semibold text-indigo-800"
            >
              {item.title}
            </Typography>

            {/* Video hiển thị */}
            {item.status === "pending" && item.localFilePath ? (
              <video
                src={
                  item.localFilePath.startsWith("http")
                    ? item.localFilePath
                    : `https://api-ndolv2.nongdanonline.cc${item.localFilePath}`
                }
                controls
                className="h-[200px] w-full rounded shadow mb-3"
              >
                Trình duyệt không hỗ trợ video
              </video>
            ) : item.youtubeLink && item.status === "uploaded" ? (
              item.youtubeLink.endsWith(".mp4") ? (
                <video
                  src={item.youtubeLink}
                  controls
                  className="h-[200px] w-full rounded shadow mb-3"
                />
              ) : (
                <iframe
                  src={
                    "https://www.youtube.com/embed/" +
                    (item.youtubeLink.match(
                      /(?:v=|\/embed\/|\.be\/)([^\s&?]+)/
                    )?.[1] || "")
                  }
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-[200px] w-full rounded shadow mb-3"
                ></iframe>
              )
            ) : (
              <div className="flex items-center justify-center h-[200px] text-red-500 font-semibold bg-gray-100 rounded shadow mb-3">
                Video không tồn tại
              </div>
            )}

            {/* Thông tin video */}
            <div className="text-sm text-gray-700 space-y-1 flex-1">
              <p>
                <strong>Danh sách phát:</strong> {item.playlistName}
              </p>
              <p>
                <strong>Tên Farm:</strong> {item.farmId?.name}
              </p>
              <p>
                <strong>Ngày đăng:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Người đăng:</strong> {item.uploadedBy?.fullName}
              </p>
              <p>
                <strong>Email:</strong> {item.uploadedBy?.email}
              </p>
              <p>
                <strong>Trạng thái:</strong> {item.status}
              </p>
            </div>

            {/* Lượt thích & Bình luận */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="cursor-pointer text-blue-600 hover:underline text-sm"
                onClick={() => fetchVideoLikesUsers(item._id, item.title)}
              >
                ❤️ Lượt thích:{" "}
                <strong>{videoLikes[item._id] ?? "Đang tải..."}</strong>
              </span>
              <span
                className="cursor-pointer text-blue-600 hover:underline text-sm"
                onClick={() => fetchVideoCommentsUsers(item._id, item.title)}
              >
                💬 Lượt bình luận:{" "}
                <strong>{videoComments[item._id] ?? "Đang tải..."}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </DialogBody>

  <DialogFooter>
    <Button color="red" onClick={() => setOpenVideoDialog(false)}>
      Đóng
    </Button>
  </DialogFooter>
</Dialog>

      {/* Dialog like */}
      <Dialog
        open={openLikesDialog}
        size="md"
        handler={() => setOpenLikesDialog(false)}
        dismiss={{ outsidePress: false }}
      >
        <DialogHeader onClick={(e) => e.stopPropagation()}>Danh sách user đã like - {selectedVideoTitle}</DialogHeader>
        <DialogBody className="space-y-4 max-h-[400px] overflow-y-auto">
          {selectedVideoLikes.length === 0 ? (
            <Typography>Chưa có ai like video này.</Typography>
          ) : (
            selectedVideoLikes.map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <img
                  src={
                    user.avatar?.startsWith("http")
                      ? user.avatar
                      : `https://api-ndolv2.nongdanonline.cc${user.avatar}`
                  }
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <Typography>{user.fullName}</Typography>
              </div>
            ))
          )}
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={() => setOpenLikesDialog(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog comment */}
      <Dialog
        open={openCommentsDialog}
        size="md"
        handler={() => setOpenCommentsDialog(false)}
        dismiss={{ outsidePress: false }}
      >
        <DialogHeader onClick={(e) => e.stopPropagation()}>Danh sách user đã bình luận - {selectedVideoTitle}</DialogHeader>
        <DialogBody className="space-y-4 max-h-[400px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {selectedVideoComments.length === 0 ? (
            <Typography>Chưa có bình luận nào.</Typography>
          ) : (
            selectedVideoComments.map((comment) => (
              <div key={comment._id} className="border-b pb-2 mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      comment.userId?.avatar?.startsWith("http")
                        ? comment.user.avatar
                        : `https://api-ndolv2.nongdanonline.cc${comment.userId?.avatar}`
                    }
                    alt={comment.userId?.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <Typography className="font-semibold">{comment.userId?.fullName}</Typography>
                    <Typography className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </div>
                </div>
                <Typography className="mt-1">{comment.comment}</Typography>
              </div>
            ))
          )}
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={(e) =>{e.stopPropagation(); setOpenCommentsDialog(false)}}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      {/* Danh sách post */}
      <Card>
  <div
    onClick={handleOpenPosts}
    className="cursor-pointer flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-md shadow"
  >
    <Typography variant="h5" className="text-gray-800 font-bold">
      Danh sách Posts 
    </Typography>
    <Typography
      variant="h5"
      className={`transform transition-transform duration-300 ${
        openPosts ? "rotate-180" : ""
      }`}
    >
      ▼
    </Typography>
  </div>

  <Collapse open={openPosts}>
    {openPosts && (
      <div className="overflow-hidden transition-all duration-300">
        <CardBody className="bg-white rounded-b-md">
          {userPosts.length === 0 ? (
            <Typography className="text-center text-gray-500 py-6">
              Chưa có bài viết nào.
            </Typography>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.slice(0, visiblePosts).map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between"
                >
                  {/* Tác giả + Ngày tạo/cập nhật */}
                  <div className="flex justify-between items-center mb-3">
                    {/* Tác giả */}
                    <div className="flex items-center gap-2">
                      {post.authorId ? (
                        <>
                          <Avatar
                            src={post.authorId.avatar ? `${BaseUrl}${post.authorId.avatar}` : "/default-avatar.png"}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {post.authorId.fullName?.length > 20
                                ? post.authorId.fullName.slice(0, 15) + "..."
                                : post.authorId.fullName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {post.authorId.role?.[0] || "Unknown"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Không rõ</span>
                      )}
                    </div>

                    {/* Ngày tạo */}
                    <Typography className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </div>

                  {/* Tiêu đề */}
                  <Typography variant="h6" className="text-lg font-bold text-blue-900 mb-2">
                    {post.title}
                  </Typography>

                  {/* Mô tả */}
                  <Typography className="text-sm text-gray-700 mb-2">
                    {post.description}
                  </Typography>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags?.map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>


                  {/* Hình ảnh */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {post.images?.length > 0 ? (
                      post.images.slice(0, 2).map((img) => (
                        <img
                          key={img}
                          src={`https://api-ndolv2.nongdanonline.cc${img}`}
                          alt={`img-${img}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      ))
                    ) : (
                      <>
                        <div className="w-full h-24 flex items-center justify-center bg-gray-100 text-gray-400 border border-dashed border-gray-300 rounded-lg">
                          Không có hình
                        </div>
                      </>
                    )}
                  </div>


                  {/* Lượt thích & Bình luận */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div
                      onClick={() => fetchPostLikesUsers(post.id, post.title)}
                      className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium text-xs cursor-pointer shadow hover:bg-red-100 transition"
                    >
                      ❤️ Lượt thích: {Array.isArray(post.like) ? post.like.length : post.like || 0}
                    </div>
                    <div
                      onClick={() => fetchPostCommentsUsers(post.id, post.title)}
                      className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-xs cursor-pointer shadow hover:bg-blue-100 transition"
                    >
                      💬 Bình luận: {commentCounts[post.id] || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {visiblePosts < userPosts.length && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleShowMorePosts} color="blue" variant="outlined">
                Xem thêm posts
              </Button>
            </div>
          )}
        </CardBody>
      </div>
    )}
  </Collapse>
</Card>

    <Dialog
      open={openPostCommentDialog}
      size="md"
      handler={() => setOpenPostCommentDialog(false)}
      dismiss={{ outsidePress: false }}
    >
      <DialogHeader>Danh sách bình luận - {selectedPostTitle}</DialogHeader>
      <DialogBody className="space-y-4 max-h-[400px] overflow-y-auto">
        {selectedPostComments.length === 0 ? (
          <Typography className="text-center text-gray-500">Không có bình luận nào.</Typography>
        ) : (
          selectedPostComments.map((comment) => (
            <div key={comment._id} className="border-b pb-2 mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={
                    comment.userId?.avatar?.startsWith("http")
                      ? comment.userId.avatar
                      : `https://api-ndolv2.nongdanonline.cc${comment.userId?.avatar}`
                  }
                  alt={comment.userId?.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <Typography className="font-semibold">
                    {comment.userId?.fullName}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
              <Typography className="mt-1">{comment.comment}</Typography>

              {/* Hiển thị reply nếu có */}
              {comment.replies?.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="border-l-2 pl-4">
                      <div className="flex items-center gap-3">
                        {reply.userId ? (
                          <>
                            <img
                              src={
                                reply.userId.avatar?.startsWith("http")
                                  ? reply.userId.avatar
                                  : `https://api-ndolv2.nongdanonline.cc${reply.userId.avatar}`
                              }
                              alt={reply.userId.fullName}
                              className="w-8 h-8 rounded-full"
                            />
                            <Typography className="font-semibold">
                              {reply.userId?.fullName}
                            </Typography>
                          </>
                        ) : (
                          <Typography className="italic text-gray-500">Ẩn danh</Typography>
                        )}
                      </div>
                      <Typography className="text-sm text-gray-700">
                        {reply.comment}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )
        }
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={() => setOpenPostCommentDialog(false)}>Đóng</Button>
      </DialogFooter>
    </Dialog>

          
        <PostLikeUserDialog
          open={openPostLikesDialog}
          onClose={() => setOpenPostLikesDialog(false)}
          postTitle={selectedPostTitle}
          likeUsers={selectedPostLikes}
        />
    </div>
  );
}
