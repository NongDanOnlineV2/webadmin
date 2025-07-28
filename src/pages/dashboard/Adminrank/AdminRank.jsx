import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Typography, Button, Input,
  Dialog, DialogHeader, DialogBody, DialogFooter,
  IconButton, Spinner, Textarea, Menu, MenuHandler, MenuList, MenuItem
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import api from "@/utils/axiosInstance"; // bạn cần file này để dùng axios có sẵn baseURL/token

export default function AdminRank() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    mainPoint: 0,
    sidePoint: 0,
    badge: "",
    benefits: [""],
  });

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin-ranks");
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
        mainPoint: rank.mainPoint,
        sidePoint: rank.sidePoint,
        badge: rank.badge,
        benefits: rank.benefits || [""],
      });
    } else {
      setEditData(null);
      setForm({
        name: "",
        mainPoint: 0,
        sidePoint: 0,
        badge: "",
        benefits: [""],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setForm({
      name: "",
      mainPoint: 0,
      sidePoint: 0,
      badge: "",
      benefits: [""],
    });
    setEditData(null);
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await api.put(`/admin-ranks/${editData._id}`, form);
      } else {
        await api.post("/admin-ranks", form);
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
      await api.delete(`/admin-ranks/${id}`);
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
    const updated = [...form.benefits];
    updated.splice(index, 1);
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
                  <th className="p-2">Điểm tối đa</th>
                  <th className="p-2">Điểm tối thiểu</th>
                  <th className="p-2">Huy hiệu</th>
                  <th className="p-2">Lợi ích</th>
                  <th className="p-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((rank) => (
                  <tr key={rank._id} className="border-b border-gray-200">
                    <td className="p-2">{rank.name}</td>
                   <td className="p-2">{rank.maxPoint}</td>
                   <td className="p-2">{rank.minPoint}</td>
                    <td className="p-2">
                      <img src={rank.badge} alt="badge" className="h-8 w-8 object-contain" />
                    </td>
                    <td className="p-2">
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {rank.benefits?.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
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
      <MenuItem
        onClick={() => handleOpenModal(rank)}
        className="flex items-center gap-2 text-blue-600"
      >
        <PencilIcon className="h-4 w-4" /> Chỉnh sửa
      </MenuItem>
      <MenuItem
        onClick={() => handleDelete(rank._id)}
        className="flex items-center gap-2 text-red-500"
      >
        <TrashIcon className="h-4 w-4" /> Xóa
      </MenuItem>
    </MenuList>
  </Menu>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
            {ranks.length === 0 && <p className="text-center text-gray-500 mt-4">Không có rank nào.</p>}
          </div>
        )}
      </CardBody>

      {/* Modal Thêm/Sửa */}
     <Dialog open={openModal} handler={handleCloseModal} size="lg">
  <div className="flex flex-col max-h-[90vh]">
    <DialogHeader>{editData ? "Cập nhật Rank" : "Thêm Rank"}</DialogHeader>
    <DialogBody className="overflow-y-auto px-4 space-y-3" style={{ maxHeight: "65vh" }}>
      <Input label="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Điểm Tối Đa" type="number" value={form.maxPoint} onChange={(e) => setForm({ ...form, maxPoint: Number(e.target.value) })} />
      <Input label="Điểm Tối Thiểu" type="number" value={form.minPoint} onChange={(e) => setForm({ ...form, minPoint: Number(e.target.value) })} />
      <Input label="URL huy hiệu" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
      <Typography variant="small" color="blue-gray">Lợi ích</Typography>
      {form.benefits.map((benefit, index) => (
        <div key={index} className="flex gap-2">
          <Textarea label={`Lợi ích ${index + 1}`} value={benefit} onChange={(e) => handleChangeBenefit(index, e.target.value)} />
          <IconButton variant="text" onClick={() => removeBenefit(index)}><TrashIcon className="h-5 w-5 text-red-400" /></IconButton>
        </div>
      ))}
      <Button variant="outlined" onClick={addBenefit}>+ Thêm lợi ích</Button>
    </DialogBody>
    <DialogFooter className="border-t border-gray-200 mt-auto">
      <Button variant="text" onClick={handleCloseModal}>Hủy</Button>
      <Button color="blue" onClick={handleSubmit}>{editData ? "Cập nhật" : "Thêm"}</Button>
    </DialogFooter>
  </div>
</Dialog>

    </Card>
  );
}
