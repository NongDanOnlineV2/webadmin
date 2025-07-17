import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";

// HTML raw nội dung
import baoMatHTML from "@/assets/html/chinh_sach_bao_mat.html?raw";
import cookieHTML from "@/assets/html/chinh_sach_cookie.html?raw";
import dieuKhoanHTML from "@/assets/html/dieu_khoản&dieu_kien.html?raw";

export default function ChinhSach() {
  const [selected, setSelected] = useState("baoMat");

  const getHTML = () => {
    switch (selected) {
      case "baoMat":
        return baoMatHTML;
      case "cookie":
        return cookieHTML;
      case "dieuKhoan":
        return dieuKhoanHTML;
      default:
        return "";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Chính Sách</h1>

      <Select
        label="Chọn chính sách"
        value={selected}
        onChange={(val) => setSelected(val)}
      >
        <Option value="baoMat">Chính sách bảo mật</Option>
        <Option value="cookie">Chính sách cookie</Option>
        <Option value="dieuKhoan">Điều khoản & điều kiện</Option>
      </Select>

      <div
        className="mt-6 bg-white shadow p-6 rounded-lg border"
        dangerouslySetInnerHTML={{ __html: getHTML() }}
      />
    </div>
  );
}
