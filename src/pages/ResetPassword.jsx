import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const BaseUrl =
    process.env.NODE_ENV === "development"
      ? "https://api-ndolv2.nongdanonline.cc"
      : "https://api-ndol-v2-prod.nongdanonline.cc";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token không tồn tại trong URL.");
      return;
    }

    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    const passwordWithoutSpaces = trimmedNewPassword.replace(/\s/g, "");

    if (passwordWithoutSpaces.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự (không tính khoảng trắng).");
      return;
    }

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const res = await fetch(`${BaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: trimmedNewPassword }),
      });

      if (res.ok) {
        setSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setError(data.message || "Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      setError("Lỗi hệ thống. Vui lòng thử lại.");
    }
  };

  const preventSpace = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
       <img
          src="/img/LogoCut2.png"
          alt="FarmTalk Logo"
          className="w-20 h-20 mx-auto mb-4"
        />
      <h2 className="text-2xl font-bold mb-4 text-green-600">Đặt lại mật khẩu</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {success ? (
        <p className="text-green-600 font-medium text-center">
          Đổi mật khẩu thành công. Vui lòng mở lại ứng dụng để đăng nhập bằng mật khẩu mới.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={preventSpace} 
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={preventSpace} 
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#00C86F] hover:bg-green-700 text-white p-2 rounded"
          >
            Xác nhận
          </button>
        </form>
      )}
    </div>
  );
}
