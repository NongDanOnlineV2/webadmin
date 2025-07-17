import React, { useState } from "react";

const ChinhSach = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#678090",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📄 Chính Sách
      </button>

      {show && (
        <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <a href="/chinhsanh/chinh_sach_bao_mat.html" target="_blank">Chính sách bảo mật</a><br />
          <a href="/chinhsanh/chinh_sach_cookie.html" target="_blank">Chính sách cookie</a><br />
          <a href="/chinhsanh/dieu_khoan_va_dieu_kien.html" target="_blank">Điều khoản & điều kiện</a>
        </div>
      )}
    </div>
  );
};

export default ChinhSach;
