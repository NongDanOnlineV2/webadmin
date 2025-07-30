import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Typography, Button, Input,
  Dialog, DialogHeader, DialogBody, DialogFooter,
  IconButton, Spinner, Textarea, Menu, MenuHandler, MenuList, MenuItem
} from "@material-tailwind/react";
import {
  PencilIcon, TrashIcon, PlusIcon, EllipsisVerticalIcon
} from "@heroicons/react/24/solid";
import { BaseUrl } from "@/ipconfig";
import axios from "axios";

export default function AdminRank() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
    const tokenUser = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: "",
    maxPoint: "",
    minPoint: "",
    badge: "",
    benefits: [""],
  });
  const [errors, setErrors] = useState({});

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/admin-ranks`,{ headers: { Authorization: `Bearer ${tokenUser}`}});
      setRanks(res.data);
    } catch (err) {
      console.error("Fetch ranks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  const handleOpenModal = (rank = null) => {
    if (rank) {
      setEditData(rank);
      setForm({
        name: rank.name,
        maxPoint: rank.maxPoint,
        minPoint: rank.minPoint,
        badge: rank.badge,
        benefits: rank.benefits?.length ? rank.benefits : [""],
      });
    } else {
      setEditData(null);
      setForm({
        name: "",
        maxPoint: "",
        minPoint: "",
        badge: "",
        benefits: [""],
      });
    }
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setForm({
      name: "",
      maxPoint: "",
      minPoint: "",
      badge: "",
      benefits: [""],
    });
    setEditData(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên không được để trống";
    if (form.maxPoint === "" || form.maxPoint < 0)
      newErrors.maxPoint = "Điểm tối đa phải ≥ 0";
    if (form.minPoint === "" || form.minPoint < 0)
      newErrors.minPoint = "Điểm tối thiểu phải ≥ 0";
    if (!form.badge.trim()) newErrors.badge = "Huy hiệu không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editData) {
        await api.put(`${BaseUrl}/admin-ranks/${editData._id}`, form);
      } else {
        await api.post(`${BaseUrl}/admin-ranks`, form);
      }
      handleCloseModal();
      fetchRanks();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá rank này không?")) return;
    try {
      await api.delete(`${BaseUrl}/admin-ranks/${id}`);
      fetchRanks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleChangeBenefit = (index, value) => {
    const updated = [...form.benefits];
    updated[index] = value;
    setForm({ ...form, benefits: updated });
  };

  const addBenefit = () => {
    setForm({ ...form, benefits: [...form.benefits, ""] });
  };

  const removeBenefit = (index) => {
    const updated = form.benefits.filter((_, i) => i !== index);
    setForm({ ...form, benefits: updated });
  };

  return (
    <Card className="m-6">
      <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-4">
        <Typography variant="h5">Quản lý Rank</Typography>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> Thêm rank
        </Button>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center"><Spinner /></div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2">Tên</th>
                  <th className="p-2">Điểm tối thiểu</th>
                  <th className="p-2">Điểm tối đa</th>
                  <th className="p-2">Huy hiệu</th>
                  <th className="p-2">Lợi ích</th>
                  <th className="p-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((rank) => (
                  <tr key={rank._id} className="border-b border-gray-200">
                    <td className="p-2">{rank.name}</td>
                    <td className="p-2">{rank.minPoint}</td>
                    <td className="p-2">{rank.maxPoint}</td>
                    <td className="p-2">
                      <img src={rank.badge} alt="badge" className="h-8 w-8 object-contain" />
                    </td>
                    <td className="p-2">
                      <ul className="list-none list-inside text-sm text-gray-700">
                        {rank.benefits?.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </td>
                    <td className="p-2 text-right">
                      <Menu placement="left-start">
                        <MenuHandler>
                          <IconButton variant="text">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem onClick={() => handleOpenModal(rank)} className="flex items-center gap-2 text-blue-600">
                            <PencilIcon className="h-4 w-4" /> Chỉnh sửa
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(rank._id)} className="flex items-center gap-2 text-red-500">
                            <TrashIcon className="h-4 w-4" /> Xóa
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ranks.length === 0 && (
              <p className="text-center text-gray-500 mt-4">Không có rank nào.</p>
            )}
          </div>
        )}
      </CardBody>

      {/* Modal Thêm/Sửa */}
      <Dialog open={openModal} handler={handleCloseModal} size="lg">
        <div className="flex flex-col max-h-[90vh]">
          <DialogHeader>{editData ? "Cập nhật Rank" : "Thêm Rank"}</DialogHeader>
          <DialogBody className="overflow-y-auto px-4 space-y-3" style={{ maxHeight: "65vh" }}>
            <div>
              <Input
                label="Tên"
                value={form.name}
                error={!!errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <Typography color="red" variant="small">{errors.name}</Typography>}
            </div>
            <div>
              <Input
                label="Điểm Tối Đa"
                type="number"
                value={form.maxPoint}
                error={!!errors.maxPoint}
                onChange={(e) => setForm({ ...form, maxPoint: Number(e.target.value) })}
              />
              {errors.maxPoint && <Typography color="red" variant="small">{errors.maxPoint}</Typography>}
            </div>
            <div>
              <Input
                label="Điểm Tối Thiểu"
                type="number"
                value={form.minPoint}
                error={!!errors.minPoint}
                onChange={(e) => setForm({ ...form, minPoint: Number(e.target.value) })}
              />
              {errors.minPoint && <Typography color="red" variant="small">{errors.minPoint}</Typography>}
            </div>
            <div>
              <Input
                label="URL huy hiệu"
                value={form.badge}
                error={!!errors.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
              {errors.badge && <Typography color="red" variant="small">{errors.badge}</Typography>}
            </div>

            <Typography variant="small" color="blue-gray">Lợi ích</Typography>
            {form.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  label={`Lợi ích ${index + 1}`}
                  value={benefit}
                  onChange={(e) => handleChangeBenefit(index, e.target.value)}
                />
                <IconButton variant="text" onClick={() => removeBenefit(index)}>
                  <TrashIcon className="h-5 w-5 text-red-400" />
                </IconButton>
              </div>
            ))}
            <Button variant="outlined" onClick={addBenefit}>+ Thêm lợi ích</Button>
          </DialogBody>
          <DialogFooter className="border-t border-gray-200 mt-auto">
            <Button variant="text" onClick={handleCloseModal}>Hủy</Button>
            <Button color="blue" onClick={handleSubmit}>
              {editData ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </div>
      </Dialog>
    </Card>
  );
}
