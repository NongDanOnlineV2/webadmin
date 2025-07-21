import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@material-tailwind/react";
import { BaseUrl } from "@/ipconfig";

export default function FarmPictures({ farmId }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmId) return;

    const fetchPictures = async () => {
  try {
    const id = farmId?.trim(); // loại bỏ \n
    const res = await axios.get(`${BaseUrl}/farm-pictures/${id}`);
    const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
    setPictures(list);
  } catch (err) {
    console.error("Lỗi ảnh:", err);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


    fetchPictures();
  }, [farmId]);

  const getImgSrc = (imgUrl) => `${BaseUrl}${imgUrl}`;

  if (loading) return <Typography>Đang tải ảnh...</Typography>;
  if (error) return <Typography color="red">Lỗi: {error}</Typography>;
  if (pictures.length === 0) return <Typography>Không có ảnh nào cho farm này.</Typography>;

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {pictures.map((pic) => (
        <div key={pic._id} className="border rounded-lg shadow overflow-hidden">
          <img
            src={getImgSrc(pic.imageUrl)}
            alt={pic.description}
            className="w-full h-36 object-cover"
          />
          <Typography className="text-center py-1 text-sm bg-gray-100">
            {pic.description || "Không có mô tả"}
          </Typography>
        </div>
      ))}
    </div>
  );
}
