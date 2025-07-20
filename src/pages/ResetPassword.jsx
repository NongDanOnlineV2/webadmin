import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BaseUrl } from "@/ipconfig"; 

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // Lấy token từ URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Token không tồn tại trong URL.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const res = await fetch(`${BaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setSuccess("✅ Đặt lại mật khẩu thành công! Đang chuyển sang trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000); // Chuyển sang trang login sau 2 giây
      } else {
        const data = await res.json();
        setError(data.message || "❌ Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      setError("❌ Lỗi hệ thống. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
}
