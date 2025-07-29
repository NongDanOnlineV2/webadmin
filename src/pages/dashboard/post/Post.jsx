import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Avatar,
  Chip,
  Dialog,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import PostDetailDialog from "./PostDetail";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "@/ipconfig";

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [filterTitle, setFilterTitle] = useState("");
  const [filterSortComments, setFilterSortComments] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sortTitle, setSortTitle] = useState("");
  const [sortDescription, setSortDescription] = useState("");
  const [sortDate, setSortDate] = useState("");
  const [filterImage, setFilterImage] = useState("");
  const [filterSortLikes, setFilterSortLikes] = useState("");

  const fetchPosts = async () => {

  setLoading(true);
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams({
    page: currentPage,
    limit: postsPerPage,
  });

  if (filterTitle) queryParams.append("title", filterTitle);
  if (filterStatus === "true") queryParams.append("status", true);
  else if (filterStatus === "false") queryParams.append("status", false);
  if (filterSortLikes) queryParams.append("sortLikes", filterSortLikes);
  if (filterSortComments) queryParams.append("sortComments", filterSortComments);
  if (sortTitle) queryParams.append("sortTitle", sortTitle);
  if (sortDescription) queryParams.append("sortDescription", sortDescription);

  try {
    const res = await fetch(
      `${BaseUrl}/admin-post-feed?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await res.json();

    if (res.ok) { 
      const fetchPosts = json.data || [];
      if (filterStatus !== "") {
        fetchPosts = fetchPosts.filter((post) => String(post.status) === filterStatus);
      }
      if (sortTitle === "asc") {
        fetchPosts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortTitle === "desc") {
        fetchPosts.sort((a, b) => b.title.localeCompare(a.title));
      }
      if (sortDate === "asc") {
        fetchPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortDate === "desc") {
        fetchPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      if (filterSortComments === "asc") {
        fetchPosts.sort((a, b) => (a.commentCount || 0) - (b.commentCount || 0));
      } else if (filterSortComments === "desc") {
        fetchPosts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
      }
      if (filterSortLikes === "asc") {
        fetchPosts.sort((a, b) => (a.like || 0) - (b.like || 0));
      } else if (filterSortLikes === "desc") {
        fetchPosts.sort((a, b) => (b.like || 0) - (a.like || 0));
      }
      setPosts(fetchPosts);
      setTotalPages(json.totalPages || 1);
    } else {
      console.error("API lỗi:", json.message);
      alert("Không lấy được dữ liệu: " + json.message);
    }
  } catch (err) {
    console.error("Fetch posts error:", err);
    alert("Không thể lấy danh sách bài viết: " + err.message);
  }

  setLoading(false);
};


  const handleFilter = () => { 
  if (currentPage === 1) {
    fetchPosts();
  } else {
    setCurrentPage(1);
  }
};

  useEffect(() => {
    fetchPosts();
  }, [currentPage, sortTitle, filterSortLikes, filterSortComments, sortDate]);

  const handleEditClick = (post) => {
    setSelectedPost({
      ...post,
      id: post._id,
      tagsInput: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    });
    setOpenEdit(true);
  };

  const updatePost = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: selectedPost.title,
        description: selectedPost.description,
        status: Boolean(selectedPost.status),
        tags: (selectedPost.tagsInput || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        images: selectedPost.images,
        authorId: typeof selectedPost.authorId === 'object'
        ? selectedPost.authorId._id
        : selectedPost.authorId,
      };


      const res = await fetch(
        `${BaseUrl}/admin-post-feed/${selectedPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (res.ok) {
        alert("Cập nhật thành công!");

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === selectedPost._id
              ? {
                  ...p,
                  title: selectedPost.title,
                  description: selectedPost.description,
                  tags: selectedPost.tagsInput
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ""),
                  status: selectedPost.status,
                  images: selectedPost.images,
                }
              : p
          )
        );
        setSelectedPost(null);
        setOpenEdit(false);
      } else {
        console.error("PUT lỗi:", json);
        alert(json.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("PUT error:", err);
      alert("Lỗi kết nối server khi cập nhật");
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xoá bài post này?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BaseUrl}/admin-post-feed/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Xoá thành công!");
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        const json = await res.json();
        console.log("🔍 API trả về:", json.data);  
        alert(json.message || "Xoá thất bại");
      }
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Không thể kết nối tới server");
    }
  };
  
  const getFilteredSortedPosts = () => {
  let result = [...posts];

  if (filterStatus !== "") {
    result = result.filter((post) => String(post.status) === filterStatus);
  }

  if (filterImage === "true") {
    result = result.filter((post) => post.images && post.images.length > 0);
  } else if (filterImage === "false") {
    result = result.filter((post) => !post.images || post.images.length === 0);
  }

  if (sortTitle === "asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortTitle === "desc") {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortDate === "asc") {
    result.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortDate === "desc") {
    result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (filterSortComments === "asc") {
    result.sort((a, b) => (a.commentCount || 0) - (b.commentCount || 0));
  } else if (filterSortComments === "desc") {
    result.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
  }

  if (filterSortLikes === "asc") {
    result.sort((a, b) => (a.like || 0) - (b.like || 0));
  } else if (filterSortLikes === "desc") {
    result.sort((a, b) => (b.like || 0) - (a.like || 0));
  }

  return result;
};

const sortedFilteredPosts = getFilteredSortedPosts();

const paginatedPosts = sortedFilteredPosts.slice(
  (currentPage - 1) * postsPerPage,
  currentPage * postsPerPage
);

  return (
    <div className="p-4">
  <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
    Danh sách bài post
  </Typography>

  {/* Bộ lọc */}
  <div className="flex justify-start items-center flex-wrap gap-3 mb-4">
  {/* Tiêu đề */}
  <div className="h-10">
    <Input
      label=" "
      placeholder="Tiêu đề"
      value={filterTitle}
      onChange={(e) => setFilterTitle(e.target.value)}
      className="w-[180px]"
      containerProps={{ className: "min-w-0" }}
    />
  </div>

  {/* Trạng thái */}
  <select
    className="h-10 border border-gray-300 rounded px-2 text-sm text-gray-700"
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="">Tất cả trạng thái</option>
    <option value="true">Đang hoạt động</option>
    <option value="false">Đã ẩn</option>
  </select>

  {/* Nút lọc */}
  <Button
    color="black"
    size="sm"
    className="h-10 px-4"
    onClick={handleFilter}
  >
    Tìm kiếm
  </Button>
</div>


  {/* Table */}
  {loading ? (
    <Typography>Đang tải dữ liệu...</Typography>
  ) : (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border">
              <div className="flex items-center justify-between gap-1">
              <span>Tiêu đề</span> 
              <select className="text-sm border rounded px-1 py-0.5"
                value={sortTitle}
                onChange={(e) => {
                  setSortTitle(e.target.value);
                  fetchPosts();
                }}
              >
                <option value="">--</option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
              </div>
            </th>
            <th className="p-3 border">
              <div className="flex flex-col gap-1">
                <span>Mô tả</span>
              </div>
              

            </th>
            
            <th className="p-3 border">
            <div className="flex items-center justify-between gap-1">
              <span>Ngày tạo</span>
              <select
                className="text-sm border rounded px-1 py-0.5"
                value={sortDate}
                onChange={(e) => {
                  setSortDate(e.target.value);
                }}
              >
                <option value="">⬍</option>
                <option value="desc">↓</option>
                <option value="asc">↑</option>
              </select>
            </div>
          </th>

            <th className="p-3 border">
              <div className="flex flex-col gap-1">
                <span>Hình</span>
        
              </div>
            </th>

             <th className="p-3 border text-center">
                <div className="flex items-center justify-between gap-1">
                  <span>Bình luận</span>
                  <select
                    className="text-sm border rounded px-1 py-0.5"
                    value={filterSortComments}
                    onChange={(e) => {
                      setFilterSortComments(e.target.value);
                    }}
                  >
                    <option value="">⬍</option>
                    <option value="desc">↓</option>
                    <option value="asc">↑</option>
                  </select>
                </div>
              </th>

            <th className="p-3 border text-center">
              <div className="flex items-center justify-between gap-1">
                <span>Lượt thích</span>
                <select
                    className="text-sm border rounded px-1 py-0.5"
                    value={filterSortLikes}
                    onChange={(e) => {
                      setFilterSortLikes(e.target.value);
                    }}
                  >
                    <option value="">⬍</option>
                    <option value="desc">↓</option>
                    <option value="asc">↑</option>
                  </select>
              </div>
            </th>

            <th className="p-3 border">
              <div className="flex flex-col gap-1">
                <span>Tác giả</span>
              </div>
            </th>
            <th className="p-3 border text-center">Trạng thái</th>
            <th className="p-3 border text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            return (
              <tr
                key={post._id}
                className="hover:bg-gray-50 cursor-pointer transition"
                onClick={() => {
                  setSelectedPostId(post._id);
                  setIsDetailOpen(true);
                }}
              >
                <td className="p-3 border">{post.title.length > 20 ? post.title.slice(0,15) + "..." : post.title}</td>
                <td className="p-3 border max-w-xs">
                  <p className="line-clamp-2 text-sm leading-snug break-words">
                    {post.description?.length > 20
                      ? post.description.slice(0, 15) + "..."
                      : post.description || "Không có mô tả"}
                  </p>
                </td>
                <td className="p-3 border">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                    : "Không rõ"}
                </td>
                <td className="p-3 border">
                  {post.images?.length > 0 ? (
                    <img
                      src={`${BaseUrl}${post.images[0]}`}
                      alt="Hình ảnh"
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </td>
                   <td className="p-3 border text-center">
                      {post.commentCount ?? 0}
                    </td>
                    <td className="p-3 border text-center">
                      {post.like ?? 0}
                    </td>
                <td className="p-3 border">
                  <div className="flex items-center gap-2">
                    {post.authorId ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {post.authorId.fullName?.length > 20
                              ? post.authorId.fullName.slice(0, 15) + "..."
                              : post.authorId.fullName}
                          </span>
                          
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Không rõ</span>
                    )}
                  </div>
                </td>
                <td className="p-3 border text-center">
                  <Chip
                    value={post.status ? "Đang hoạt động" : "Đã ẩn"}
                    color={post.status ? "teal" : "red"}
                    size="sm"
                  />
                </td>
                <td className="p-3 border text-center">
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <IconButton variant="text"><EllipsisVerticalIcon className="h-5 w-5" /></IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(post);
                        }}
                      >
                        Sửa
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post._id);
                        }}
                        className="text-red-500"
                      >
                        Xoá
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            );
          })}
          {posts.length === 0 && (
            <tr>
              <td colSpan="9" className="p-3 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Dialog open={openEdit} handler={() => setOpenEdit(false)} size="md">
        <div className="p-4">
          <Typography variant="h6" className="mb-4">
            Chỉnh sửa bài viết
          </Typography>

          <div className="space-y-3">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tác giả
              </label>
              <Input
                value={
                  typeof selectedPost?.authorId === "object"
                    ? selectedPost.authorId.fullName
                    : "Không rõ"
                }
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Tiêu đề */}
            <Input
              label="Tiêu đề"
              value={selectedPost?.title || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, title: e.target.value })
              }
            />

            {/* Mô tả */}
            <Input
              label="Mô tả"
              value={selectedPost?.description || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, description: e.target.value })
              }
            />

            {/* Tags */}
            <Input
              label="Tags (phân cách bằng dấu phẩy)"
              value={selectedPost?.tagsInput || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, tagsInput: e.target.value })
              }
            />

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={selectedPost?.status ? "true" : "false"}
                onChange={(e) =>
                  setSelectedPost({
                    ...selectedPost,
                    status: e.target.value === "true",
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã ẩn</option>
              </select>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-2 mt-4">
            <Button color="red" onClick={() => setOpenEdit(false)}>
              Hủy
            </Button>
            <Button
              color="green"
              onClick={() => {
                updatePost();
              }}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Dialog>

 
      <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
        {/* First page */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          «
        </Button>

        {/* Prev */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </Button>

        {/* Dynamic page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 2
            );
          })
          .reduce((acc, page, i, arr) => {
            if (i > 0 && page - arr[i - 1] > 1) {
              acc.push("ellipsis");
            }
            acc.push(page);
            return acc;
          }, [])
          .map((item, index) =>
            item === "ellipsis" ? (
              <span key={index} className="px-2 text-gray-500">...</span>
            ) : (
              <Button
                key={index}
                size="sm"
                variant={currentPage === item ? "filled" : "outlined"}
                className={`min-w-[32px] ${currentPage === item ? "bg-black text-white" : ""}`}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </Button>
            )
          )}

        {/* Next */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </Button>

        {/* Last page */}
        <Button
          size="sm"
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          »
        </Button>
      </div>

          </div>
        )}

  <PostDetailDialog
  postId={selectedPostId}
  open={isDetailOpen}
  onClose={() => setIsDetailOpen(false)}
/>
</div>

  );
}

export default PostList;
