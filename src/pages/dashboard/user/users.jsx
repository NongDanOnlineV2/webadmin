import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance"; // thay axios = api
import axios from 'axios';
import {
  Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem,
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Input, Select, Option, Button, Spinner, Avatar
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from '@/ipconfig';
import CreatableSelect from 'react-select/creatable';
const allFarms = { current: [] };
const allVideos = { current: [] };
const allPosts = { current: [] };
export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", isActive: true,
  });
  const [selectedRole, setSelectedRole] = useState("Farmer");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [cacheUsers, setCacheUsers] = useState([]);

  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BaseUrl = "https://api-ndolv2.nongdanonline.cc";
const fetchAllData = async () => {
    try {
      const getAllPages = async (endpoint) => {
        let page = 1;
        let items = [];
        while (true) {
          const res = await axios.get(`${BaseUrl}/${endpoint}?page=${page}&limit=100`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = res.data?.data || [];
          if (!data.length) break;
          items = [...items, ...data];
          page++;
        }
        return items;
      };

    } catch (err) {
      console.error("Lỗi tải toàn bộ farms/videos/posts:", err);
    }
  };
  // Fetch users + counts
    const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.isActive = filterStatus === "Active";

    const res = await api.get(`${BaseUrl}/admin-users`, { params }); 
    const usersData = res.data?.data || [];

      const postMap = {};
      allPosts.current.forEach(p => {
        const uid = p.userId || p.authorId?.id;
        if (uid) postMap[uid] = (postMap[uid] || 0) + 1;
      });

      const countsMap = {};
      usersData.forEach(u => {
        countsMap[u.id] = {
          posts: postMap[u.id] || 0,
          farms: allFarms.current.filter(f => f.ownerId === u.id).length,
          videos: allVideos.current.filter(v => v.uploadedBy?.id === u.id).length
        };
      });

      setUsers(usersData);
      setCounts(countsMap);
      setTotalPages(res.data.totalPages || 1);
      setCacheUsers(prev => [...prev, {
        page,
        role: filterRole,
        status: filterStatus,
        searchText,
        users: usersData,
        totalPages: res.data.totalPages || 1,
        counts: countsMap
      }]);
      const formatRole = (r) => r?.trim().charAt(0).toUpperCase() + r?.trim().slice(1).toLowerCase();
      const allRoles = Array.from(new Set(
        usersData
          .flatMap(u => Array.isArray(u.role) ? u.role : [u.role])
          .filter(Boolean)
          .map(formatRole)
      ));

    setRoles(allRoles);
    } catch (err) {
      console.error("Lỗi fetch users:", err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (!token) return;
  setRoles(["Admin", "Farmer", "Staff", "Customer"]);
  fetchAllData()
    .catch((err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });
}, []);
  // Search
const handleSearch = async () => {
  if (!token) return;
  setLoading(true);
  setIsSearching(true);
  setPage(1); // đảm bảo về trang 1
  try {
    const params = {
      page: 1,
      limit: 10,
    };
    if (filterRole) params.role = filterRole;
    if (filterStatus) params.isActive = filterStatus === "Active";
    if (searchText.trim()) params.fullName = searchText.trim();

    const res = await api.get(`${BaseUrl}/admin-users`, { params });
    const usersData = res.data?.data || [];

    // đếm số lượng như cũ
    const postMap = {};
    allPosts.current.forEach(p => {
      const uid = p.userId || p.authorId?.id;
      if (uid) postMap[uid] = (postMap[uid] || 0) + 1;
    });

    const countsMap = {};
    usersData.forEach(u => {
      countsMap[u.id] = {
        posts: postMap[u.id] || 0,
        farms: allFarms.current.filter(f => f.ownerId === u.id).length,
        videos: allVideos.current.filter(v => v.uploadedBy?.id === u.id).length,
      };
    });

    setUsers(usersData);
    setCounts(countsMap);
    setTotalPages(res.data.totalPages || 1);

    // 🛠 Giữ chế độ tìm kiếm cho đến khi người dùng "xoá tìm kiếm"
    // Không setIsSearching(false) ở đây
  } catch (err) {
    console.error("Lỗi tìm kiếm người dùng:", err);
    alert("Không thể tìm kiếm người dùng!");
    setIsSearching(false); // nếu lỗi thì tắt chế độ
  } finally {
    setLoading(false);
  }
};



 useEffect(() => {
  if (!token) {
    setError("Không tìm thấy token!");
    setLoading(false);
    return;
  }

  if (isSearching) return;

  // const cached = cacheUsers.find(
  //   (entry) =>
  //     entry.page === page &&
  //     entry.role === filterRole &&
  //     entry.status === filterStatus &&
  //     entry.searchText === searchText
  // );

  // if (cached) {
  //   // ⚡ Load từ cache nếu đã có
  //   setUsers(cached.users);
  //   setTotalPages(cached.totalPages || 1);
  //   setCounts(cached.counts || {});
  //   setLoading(false);
  // } else {
  //   // 🚀 Nếu chưa cache thì mới fetch
    fetchUsers();
  // }
}, [token, page, filterRole, filterStatus, isSearching]);


  // Edit
  const openEdit = (user) => {
  setSelectedUser(user);
  setFormData({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || "",
    isActive: user.isActive
  });
  setEditOpen(true);
};

  
// CẬP NHẬT NGƯỜI DÙNG + ĐỊA CHỈ
 const handleUpdate = async () => {
    if (!token || !selectedUser) return;
    const hasStatusChanged = formData.isActive !== selectedUser.isActive;
    try {
      await axios.put(`${BaseUrl}/admin-users/${selectedUser._id}`, { fullName: formData.fullName, phone: formData.phone }, { headers: { Authorization: `Bearer ${token}` } });

    if (hasStatusChanged) {
      await axios.patch(
        `${BaseUrl}/admin-users/${selectedUser._id}/active`,
        {
          isActive: formData.isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    alert("Cập nhật thành công!");
    fetchUsers();
    setEditOpen(false);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);

    const message =
      error.response?.data?.message || "Cập nhật thất bại! Vui lòng thử lại.";

    alert(message);
  }
  };

 const handleToggleActive = async (val) => {
  if (!token || !selectedUser) return;

  const isCurrentlyActive = selectedUser.isActive;
  const newIsActive = val === "Active";

  // Nếu trạng thái không thay đổi
  if (isCurrentlyActive === newIsActive) {
    alert(`Người dùng đã ở trạng thái ${newIsActive ? "Active" : "Inactive"} rồi.`);
    return;
  }

  try {
    await axios.patch(`${BaseUrl}/admin-users/${selectedUser._id}/active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setFormData(prev => ({ ...prev, isActive: newIsActive }));
    setUsers(prev =>
      prev.map(u => u.id === selectedUser._id ? { ...u, isActive: newIsActive } : u)
    );

    alert("Cập nhật trạng thái thành công!");
  } catch {
    alert("Cập nhật trạng thái thất bại!");
  }
};

  const handleDelete = async (userId) => {
  if (!userId) return alert("Không tìm thấy ID người dùng để xoá!");
  if (!window.confirm("Bạn chắc chắn muốn xoá?")) return;

  try {
    const response = await axios.delete(`${BaseUrl}/admin-users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Xoá thành công:", response.data);
    alert("Đã xoá người dùng!");

    // ✅ Xoá trực tiếp khỏi state
    setUsers(prev => prev.filter(u => u.id !== userId));

    // ✅ Xoá khỏi counts luôn
    setCounts(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });

    // ✅ Xoá khỏi cacheUsers (nếu muốn giữ cache đúng)
    setCacheUsers(prev => prev.map(item => ({
      ...item,
      users: item.users.filter(u => u.id !== userId),
      counts: Object.fromEntries(
        Object.entries(item.counts).filter(([key]) => key !== userId)
      )
    })));

  } catch (error) {
    console.error("Lỗi xoá người dùng:", error?.response?.data || error.message);
    alert("Xoá thất bại!");
  }
};



  const handleAddRole = async () => {
    if (!token || !selectedUser) return;
    try {
      if (selectedRole === "Farmer") {
        await axios.patch(`${BaseUrl}/admin-users/${selectedUser._id}/add-farmer`, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.patch(`${BaseUrl}/admin-users/${selectedUser._id}/add-role`, { role: selectedRole }, { headers: { Authorization: `Bearer ${token}` } });
      }
      alert("Thêm role thành công!");
      fetchUsers();
    } catch {
      alert("Thêm role thất bại!");
    }
  };

  const handleRemoveRole = async (role) => {
    if (!token || !selectedUser) return;
    try {
      await axios.patch(`${BaseUrl}/admin-users/${selectedUser._id}/remove-roles`, { roles: [role] }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Xoá role thành công!");
      fetchUsers();
    } catch {
      alert("Xoá role thất bại!");
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">Quản lý người dùng</Typography>

     <div className="flex flex-wrap items-center gap-4 mb-4">
  <div className="w-64">
    <Input
  label="Tìm kiếm..."
  value={searchText}
  onChange={(e) => {
    const val = e.target.value;
    setSearchText(val);

    if (val.trim() === "") {
      setIsSearching(false);   // Reset chế độ tìm
      setPage(1);              // Reset về trang 1
      fetchUsers();            // Gọi lại API mặc định
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
  }}
/>

  </div>
  <div className="w-52">
  <Select label="Role" value={filterRole} onChange={val => setFilterRole(val || "")}>
    <Option value="">Tất cả</Option>
    <Option value="Admin">Admin</Option>
    <Option value="Staff">Staff</Option>
    <Option value="Customer">Customer</Option>
    <Option value="Farmer">Farmer</Option>
  </Select>
</div>

  <div className="w-52">
    <Select label="Trạng thái" value={filterStatus} onChange={val => setFilterStatus(val || "")}>
      <Option value="">Tất cả</Option>
      <Option value="Active">Active</Option>
      <Option value="Inactive">Inactive</Option>
    </Select>
  </div>


  <div>
    <Button className="bg-black text-white" onClick={handleSearch}>
      TÌM KIẾM
    </Button>
  </div>
</div>



      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {["Avatar", "Tên", "Email", "Phone", "Role", 
              "Posts", "Farms", "Videos"
              , "Trạng thái", "Thao tác"].map(head => (
                <th key={head} className="p-2 text-left text-xs font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map(user => (
            <tr key={user.id || user._id} className="border-t hover:bg-blue-50 cursor-pointer" onClick={() => navigate(`/dashboard/users/${user._id}`)}>
              <td className="p-2">
                <Avatar src={user.avatar ? `${BaseUrl}${user.avatar}` : ""} size="sm" />
              </td>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone || "N/A"}</td>
              <td className="p-2 text-xs">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</td>

              {/* Dữ liệu đếm - có thể dùng trực tiếp từ user nếu API trả về luôn */}
              <td className="p-2">{user.postCount ?? 0}</td>
              <td className="p-2">{user.farmCount ?? 0}</td>
              <td className="p-2">{user.videoCount ?? 0}</td>

              <td className="p-2">
                {user.isActive
                  ? <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">Active</span>
                  : <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Inactive</span>}
              </td>
              <td className="p-2" onClick={e => e.stopPropagation()}>
                <Menu placement="left-start">
                  <MenuHandler>
                    <IconButton variant="text"><EllipsisVerticalIcon className="h-5 w-5" /></IconButton>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => openEdit(user)}>Sửa</MenuItem>
                    <MenuItem onClick={() => handleDelete(user._id)} className="text-red-500">Xoá</MenuItem>
                  </MenuList>
                </Menu>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

     {!isSearching && (
  <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
  <button
    disabled={page <= 1}
    className="px-3 py-1 border border-black rounded disabled:opacity-50"
    onClick={() => setPage(page - 1)}
  >
    &laquo;
  </button>

  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
    <button
      key={p}
      className={`px-3 py-1 border border-black rounded ${
        p === page
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-black hover:text-white"
      }`}
      onClick={() => setPage(p)}
    >
      {p}
    </button>
  ))}

  <button
    disabled={page >= totalPages}
    className="px-3 py-1 border border-black rounded disabled:opacity-50"
    onClick={() => setPage(page + 1)}
  >
    &raquo;
  </button>
</div>
)}


    <Dialog open={editOpen} handler={setEditOpen} size="sm">
  <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
  <DialogBody className="space-y-4">
    <Input
      label="Full Name"
      value={formData.fullName}
      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
    />
    <Input label="Email" value={formData.email} disabled />
    <Input
      label="Phone"
      value={formData.phone}
      onChange={e => setFormData({ ...formData, phone: e.target.value })}
    />
  <Select
  label="Trạng thái"
  value={formData.isActive ? "Đã cấp quyền" : "Chưa cấp quyền"}
  onChange={val => setFormData({ ...formData, isActive: val === "Đã cấp quyền" })}
>
  <Option value="Đã cấp quyền">Active</Option>
  <Option value="Chưa cấp quyền">Inactive</Option>
</Select>
    <div className="flex flex-col sm:flex-row sm:items-end gap-2">
      <div className="w-full sm:w-60">
        <Select
          label="Chọn role để thêm"
          value={selectedRole}
          onChange={(val) => setSelectedRole(val)}
        >
          {["Admin", "Farmer", "Staff", "Customer"].map((r) => (
            <Option key={r} value={r}>{r}</Option>
          ))}
        </Select>
      </div>
      <Button
        size="sm"
        className="h-10 px-4 bg-black text-white"
        onClick={handleAddRole}
      >
        THÊM
      </Button>
    </div>

    <div className="flex flex-wrap gap-2 mt-2">
      {(Array.isArray(selectedUser?.role) ? selectedUser.role : [selectedUser?.role])
        .filter(Boolean)
        .map(role => (
          <span
            key={`${selectedUser?.id}-${role}`}
            className="flex items-center bg-blue-gray-100 rounded-full px-2 py-1 text-xs"
          >
            {role}
            <button
              className="ml-1 text-red-500"
              onClick={() => handleRemoveRole(role)}
            >
              ×
            </button>
          </span>
        ))}
    </div>
  </DialogBody>
  <DialogFooter>
    <Button variant="text" onClick={() => setEditOpen(false)}>
      Huỷ
    </Button>
    <Button variant="gradient" onClick={handleUpdate}>
      Lưu
    </Button>
  </DialogFooter>
</Dialog>

    </div>
  );
}
