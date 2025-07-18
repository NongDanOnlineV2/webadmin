  import React, { useEffect, useState } from "react";
  import {
    Typography,
    Button,
    Avatar,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
  } from "@material-tailwind/react";
  import { Audio } from "react-loader-spinner";

  const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

  export default function PostDetailDialog({ postId, open, onClose }) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [likeUsers, setLikeUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [likeDialogOpen, setLikeDialogOpen] = useState(false); 
   

    const token = localStorage.getItem("token");

    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin-post-feed/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        if (res.ok) {
          setPost(json);
        } else {
          alert(json.message || "Không thể lấy bài viết");
        }
      } catch (err) {
        console.error("Fetch post error:", err);
        alert("Lỗi khi lấy dữ liệu bài viết");
      } finally {
        setLoading(false);
      }
    };

    

    const fetchComments = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin-comment-post/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (res.ok) {
      // ✅ Fix: dùng json.data thay vì json.comments
      const commentsArray = Array.isArray(json?.data) ? json.data : [];

      console.log("✅ Comments loaded:", commentsArray);

      setComments(commentsArray);
    } else {
      console.warn("⚠️ Lỗi khi fetch comments:", json);
      setComments([]);
    }
  } catch (err) {
    console.error("❌ Fetch comments error:", err);
    setComments([]);
  } finally {
    setCommentLoading(false);
  }
};


    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        let allUsers = [];
        let page = 1;
        let totalPages = 1;
      do {
        const res = await fetch(`${BASE_URL}/admin-users?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        console.log(`User page ${page}:`, json);
        if (res.ok && Array.isArray(json.data)) {
          allUsers = allUsers.concat(json.data);
          totalPages = json.totalPages || 1; 
          page++;
        } else {
          console.warn("Danh sách users không hợp lệ:", json); 
          break;
        }
      } while (page <= totalPages); 
      setUsers(allUsers); 
      } catch (err) {
        console.error("Fetch users error:", err);
        setUsers([])
      }
    };

    const fetchLikeUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/post-feed/${postId}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.users)) {
        setLikeUsers(json.users);
      } else {
        setLikeUsers([]);
      }
    } catch (err) {
      console.error("Fetch like users error:", err);
      setLikeUsers([]);
    }
  };

    useEffect(() => {
      if (open) {
        setPost(null);
        setComments([]);
        fetchPost();
        fetchComments();
        fetchUsers();
        setShowComments(false);
      }
    }, [postId, open]);

    


    const findUser = (userId) =>
      users.find((u) => u.id === userId || u._id === userId) || null;

    const formatDateTime = (dateString) => {
      if (!dateString) return "Không rõ";
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN");
    };

    return (
      <>
      <Dialog
  open={open}
  handler={onClose}
  className={`rounded-lg mx-auto ${
    post?.images?.length === 0 
    ? "max-w-lg" 
    : post?.images?.length === 1
    ? "max-w-xl" 
    : post?.images?.length === 2
    ? "max-w-3xl" 
    : "max-w-5xl" 
  }`}
>
  <DialogHeader className="flex justify-between items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t px-4 py-2 shadow">
    <Typography variant="h5" className="font-semibold">Chi tiết bài viết</Typography>
    <Button size="sm" onClick={onClose}>Đóng</Button>
  </DialogHeader>

  <DialogBody className="max-h-[75vh] overflow-y-auto px-4 py-2">
    {loading ? (
      <div className="flex justify-center items-center h-60">
        <Audio height="80" width="80" color="green" ariaLabel="loading" />
      </div>
    ) : !post ? (
      <Typography className="text-center">Không tìm thấy bài viết</Typography>
    ) : (
      <>
        {/* Tác giả và ngày */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {post.authorId ? (
              <>
                <Avatar
                  src={post.authorId.avatar ? `${BASE_URL}${post.authorId.avatar}` : "/default-avatar.png"}
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
          <div className="text-sm text-gray-500 text-right">
            <p><b>Ngày tạo:</b> {formatDateTime(post.createdAt)}</p>
            <p><b>Cập nhật:</b> {formatDateTime(post.updatedAt)}</p>
          </div>
        </div>

        {/* Tiêu đề */}
        <Typography variant="h4" className="font-bold mb-3 text-indigo-800">
          {post.title}
        </Typography>

        {/* Mô tả */}
        <Typography className="mb-3 text-sm text-gray-700 leading-snug">
          <b>Mô tả:</b> {post.description}
        </Typography>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3 items-center">
            <Typography className="font-semibold text-gray-700">Tags:</Typography>
            {post.tags.map((tag, idx) => (
              <Chip key={idx} value={tag} color="blue-gray" size="sm" />
            ))}
          </div>
        )}

        {/* Hình ảnh */}
        {post.images?.length > 0 && (
          <>
            <Typography className="mb-1 font-semibold text-gray-700">Hình ảnh:</Typography>
            <div
              className={`grid gap-2 mb-3 ${
                post.images.length === 1
                  ? "grid-cols-1"
                  : post.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}${img}`}
                  alt={`img-${idx}`}
                  className="w-full h-52 object-cover rounded shadow"
                />
              ))}
            </div>
          </>
        )}

        {/* Trạng thái và like */}
        <div className="flex gap-4 items-center mb-3">
          <div className="flex items-center gap-1">
            <Typography className="font-semibold">Trạng thái:</Typography>
            <Chip
              value={post.status ? "Hoạt động" : "Ẩn"}
              color={post.status ? "teal" : "red"}
              size="sm"
            />
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {fetchLikeUsers(); setLikeDialogOpen(true)}}
          >
            <Typography className="font-semibold">Lượt thích:</Typography>
            <Chip value={post.like || 0} color="blue" size="sm" />
          </div>
        </div>

        {/* Bình luận */}
        <div className="border-t pt-3">
          <div
            className="cursor-pointer mb-2"
            onClick={() => setShowComments(!showComments)}
          >
            <Typography variant="h5" className="text-blue-800">
              Bình luận ({comments.reduce((acc, cmt) => acc + 1 + (cmt.replies?.length || 0), 0)})
            </Typography>
          </div>

          {showComments && (
            <>
              {commentLoading ? (
                <Typography>Đang tải bình luận...</Typography>
              ) : comments.length > 0 ? (
                comments.map((cmt) => (
                  <div key={cmt._id} className="border-b py-2 flex gap-2">
                    <Avatar
                      src={
                        cmt.userId?.avatar?.startsWith("http")
                          ? cmt.userId.avatar
                          : `${BASE_URL}${cmt.userId?.avatar || ""}`
                      }
                      alt={cmt.userId?.fullName}
                      size="sm"
                    />
                    <div className="flex-1">
                      <Typography className="font-medium">
                        {cmt.userId?.fullName || "Ẩn danh"}
                      </Typography>
                      <Typography className="text-sm text-gray-700">{cmt.comment}</Typography>

                      {/* Replies */}
                      {cmt.replies?.length > 0 && (
                        <div className="ml-4 mt-1 border-l pl-2 border-blue-100">
                          {cmt.replies.map((rep, idx) => {
                            const replyUser = findUser(rep.userId);
                            return (
                              <div key={idx} className="flex gap-1 mt-1">
                                <Avatar
                                  src={
                                    replyUser?.avatar?.startsWith("http")
                                      ? replyUser.avatar
                                      : `${BASE_URL}${replyUser?.avatar || ""}`
                                  }
                                  alt={replyUser?.fullName}
                                  size="xs"
                                />
                                <div>
                                  <Typography className="font-semibold text-sm">
                                    {replyUser?.fullName || "Ẩn danh"}:
                                  </Typography>
                                  <Typography className="text-sm">{rep.comment}</Typography>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <Typography>Không có bình luận</Typography>
              )}
            </>
          )}
        </div>
      </>
    )}
    <Dialog
  open={likeDialogOpen}
  handler={() => setLikeDialogOpen(false)}
  className="max-w-md z-50"
>
  <DialogHeader className="flex justify-between items-center">
    <Typography variant="h5">Người đã thích bài viết</Typography>
    <Button size="sm" onClick={() => setLikeDialogOpen(false)}>
      Đóng
    </Button>
  </DialogHeader>
  <DialogBody className="max-h-[60vh] overflow-y-auto">
    {likeUsers.length > 0 ? (
      likeUsers.map((user) => (
        <div key={user._id || user.id} className="flex items-center gap-3 mb-2">
          <Avatar
            src={
              user.avatar?.startsWith("http")
                ? user.avatar
                : `${BASE_URL}${user.avatar || ""}`
            }
            size="sm"
          />
          <div>
            <Typography className="font-medium">{user.fullName}</Typography>
            <Typography className="text-xs text-gray-500">{user.email}</Typography>
          </div>
        </div>
      ))
    ) : (
      <Typography>Chưa có ai thích bài viết này.</Typography>
    )}
  </DialogBody>
</Dialog>
  </DialogBody>
</Dialog>

</>
    );
  }
