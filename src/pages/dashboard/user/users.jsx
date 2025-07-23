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
    fullName: "", email: "", phone: "", isActive: true, selectedAddress: ""
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
  // const BaseUrl = "https://api-ndolv2.nongdanonline.cc";
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

      // [allFarms.current, allVideos.current, allPosts.current] = await Promise.all([
      //   getAllPages("adminfarms"),
      //   getAllPages("admin-video-farm"),
      //   getAllPages("admin-post-feed")
      // ]);
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

    const res = await api.get(`/admin-users`, { params }); 
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
        users: usersData,
        totalPages: res.data.totalPages || 1,
        counts: countsMap
      }]);

      const allRoles = Array.from(new Set(
        usersData.flatMap(u => Array.isArray(u.role) ? u.role : [u.role])
      )).filter(Boolean);
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

  fetchAllData()
    // .then(fetchUsers)
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
    try {
      const paramsCommon = { page: 1, limit: 10 };
      if (filterRole) paramsCommon.role = filterRole;
      if (filterStatus) paramsCommon.isActive = filterStatus === "Active";

      const [byName, byEmail, byPhone] = await Promise.all([
        axios.get(`${BaseUrl}/admin-users`, { headers: { Authorization: `Bearer ${token}` }, params: { ...paramsCommon, fullName: searchText } }),
        // axios.get(`${apiUrl}/admin-users`, { headers: { Authorization: `Bearer ${token}` }, params: { ...paramsCommon, email: searchText } }),
        // axios.get(`${apiUrl}/admin-users`, { headers: { Authorization: `Bearer ${token}` }, params: { ...paramsCommon, phone: searchText } }),
      ]);
      const merged = [...(byName.data.data || []), ...(byEmail.data.data || []), ...(byPhone.data.data || [])];
      const unique = merged.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setUsers(unique);
      setTotalPages(1);
      setPage(1);
      setIsSearching(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Lỗi khi tìm kiếm.");
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

  const cached = cacheUsers.find(
    (entry) =>
      entry.page === page &&
      entry.role === filterRole &&
      entry.status === filterStatus
  );

  if (cached) {
    // ⚡ Load từ cache nếu đã có
    setUsers(cached.users);
    setTotalPages(cached.totalPages || 1);
    setCounts(cached.counts || {});
    setLoading(false);
  } else {
    // 🚀 Nếu chưa cache thì mới fetch
    fetchUsers();
  }
}, [token, page, filterRole, filterStatus, isSearching]);


  // Edit
  const openEdit = async  (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName, email: user.email,
      phone: user.phone || "", isActive: user.isActive,
      selectedAddress: "",
    });
    try {
    const res = await axios.get(`${BaseUrl}/admin/user-address/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserAddresses(res.data || []);
    if (res.data.length > 0) {
      setFormData(prev => ({
        ...prev,
        selectedAddress: res.data[0].address
      }));
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    setUserAddresses([]);
  }

    setEditOpen(true);
  };
  
// CẬP NHẬT NGƯỜI DÙNG + ĐỊA CHỈ
 const handleUpdate = async () => {
    if (!token || !selectedUser) return;
    try {
      await axios.put(`${BaseUrl}/admin-users/${selectedUser.id}`, { fullName: formData.fullName, phone: formData.phone }, { headers: { Authorization: `Bearer ${token}` } });

      if (formData.isActive !== selectedUser.isActive) {
        await axios.patch(`${BaseUrl}/admin-users/${selectedUser.id}/active`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }

      if (selectedUser.addresses?.[0]?.id) {
        await axios.put(`${BaseUrl}/user-addresses/${selectedUser.addresses[0].id}`, { address: formData.addresses[0] }, { headers: { Authorization: `Bearer ${token}` } });
      }
      alert("Cập nhật thành công!");
      fetchUsers();
      setEditOpen(false);
    } catch {
      alert("Cập nhật thất bại!");
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
    await axios.patch(`${BaseUrl}/admin-users/${selectedUser.id}/active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setFormData(prev => ({ ...prev, isActive: newIsActive }));
    setUsers(prev =>
      prev.map(u => u.id === selectedUser.id ? { ...u, isActive: newIsActive } : u)
    );

    alert("Cập nhật trạng thái thành công!");
  } catch {
    alert("Cập nhật trạng thái thất bại!");
  }
};

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá?")) return;
    try {
      await axios.delete(`${BaseUrl}/admin-users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Đã xoá người dùng!");
      fetchUsers();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  const handleAddRole = async () => {
    if (!token || !selectedUser) return;
    try {
      if (selectedRole === "Farmer") {
        await axios.patch(`${BaseUrl}/admin-users/${selectedUser.id}/add-farmer`, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.patch(`${BaseUrl}/admin-users/${selectedUser.id}/add-role`, { role: selectedRole }, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.patch(`${BaseUrl}/admin-users/${selectedUser.id}/remove-roles`, { roles: [role] }, { headers: { Authorization: `Bearer ${token}` } });
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
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
    />
  </div>

  <div className="w-52">
    <Select label="Trạng thái" value={filterStatus} onChange={val => setFilterStatus(val || "")}>
      <Option value="">Tất cả</Option>
      <Option value="Active">Active</Option>
      <Option value="Inactive">Inactive</Option>
    </Select>
  </div>

  <div className="w-52">
   <Select
  label="Lọc theo role"
  value={filterRole}
  onChange={(val) => setFilterRole(val ?? "")}
>
  <Option value="">Tất cả</Option>
  {roles.map(role => (
    <Option key={role} value={role}>{role}</Option>
  ))}
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
              // "Posts", "Farms", "Videos"
              , "Trạng thái", "Thao tác"].map(head => (
                <th key={head} className="p-2 text-left text-xs font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-blue-50 cursor-pointer"
                  onClick={() => 
                  navigate(`/dashboard/users/${user._id}`)
            }>
                <td className="p-2"><Avatar src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""} size="sm" /></td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "N/A"}</td>
                <td className="p-2 text-xs">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</td>
                {/* <td className="p-2">{counts[user.id]?.posts ?? 0}</td>
                <td className="p-2">{counts[user.id]?.farms ?? 0}</td>
                <td className="p-2">{counts[user.id]?.videos ?? 0}</td> */}
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
                      <MenuItem onClick={() => handleDelete(user.id)} className="text-red-500">Xoá</MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isSearching && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button size="sm" variant="outlined" disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Trang trước</Button>
          <span>Trang {page} / {totalPages}</span>
          <Button size="sm" variant="outlined" disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Trang sau</Button>
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
    <Typography className="font-bold">Quản lý role</Typography>
    <Select label="Thêm role" value={selectedRole} onChange={setSelectedRole}>
      {roles.map(role => (
        <Option key={role} value={role}>{role}</Option>
      ))}
    </Select>
    <Button size="sm" variant="outlined" onClick={handleAddRole}>
      + Thêm Role
    </Button>
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
