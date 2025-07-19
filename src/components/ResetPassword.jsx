import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const [isTokenValid, setIsTokenValid] = useState(false);

  const BASE_URL = localStorage.getItem("apiBaseUrl") || "https://api-ndolv2.nongdanonline.cc";

  useEffect(() => {
    // Có verify token không? Có → gọi API verify riêng
    const checkTokenValidity = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/verify-reset-token/${token}`);
        if (res.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setError("Token không hợp lệ hoặc đã hết hạn.");
        }
      } catch {
        setIsTokenValid(false);
        setError("Lỗi khi xác minh token.");
      }
    };
    if (token) checkTokenValidity();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Đặt lại mật khẩu thành công! Chuyển hướng về trang đăng nhập...");
        setTimeout(() => navigate("/auth/sign-in"), 3000);
      } else {
        setError(data.message || "Lỗi khi đặt lại mật khẩu.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="red">
          {error || "Đang xác minh token..."}
        </Typography>
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-6 w-full max-w-md">
        <Typography variant="h4" color="blue-gray" className="text-center mb-4">
          Đặt lại mật khẩu
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Mật khẩu mới
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Xác nhận mật khẩu
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Typography variant="small" color="red" className="text-center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="small" color="green" className="text-center">
              {success}
            </Typography>
          )}
          <Button type="submit" fullWidth>
            Đặt lại mật khẩu
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default ResetPassword;
