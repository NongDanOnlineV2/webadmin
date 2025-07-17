import React from "react";
import baoMatHTML from "@/assets/html/chinh_sach_bao_mat.html?raw";
import cookieHTML from "@/assets/html/chinh_sach_cookie.html?raw";
import dieuKhoanHTML from "@/assets/html/dieu_khoản&dieu_kien.html?raw";

export default function ChinhSach({ type = "baoMat" }) {
  const getHTML = () => {
    switch (type) {
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
    <div className="p-6 max-w-4xl mx-auto">
      <div
        className="bg-white shadow p-6 rounded-lg border"
        dangerouslySetInnerHTML={{ __html: getHTML() }}
      />
    </div>
  );
}
