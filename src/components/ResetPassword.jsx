import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Input, Button, Typography } from "@material-tailwind/react";

function ResetPassword() {
const location = useLocation();
const navigate = useNavigate();
const [token, setToken] = useState("");
const [isTokenValid, setIsTokenValid] = useState(false);
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const BASE_URL = localStorage.getItem("apiBaseUrl") || "https://api-ndolv2.nongdanonline.cc";

useEffect(() => {
const queryParams = new URLSearchParams(location.search);
const tokenFromUrl = queryParams.get("token");
if (tokenFromUrl) {
setToken(tokenFromUrl);
setIsTokenValid(true); // Nếu không có API verify riêng, mặc định cho phép
} else {
setError("Token không hợp lệ hoặc đã hết hạn.");
}
}, [location]);

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

javascript
Copy
Edit
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
    body: JSON.stringify({ token, newPassword: password }),
  });

  const data = await res.json();
  if (res.ok) {
    setSuccess("Đặt lại mật khẩu thành công!");
    setTimeout(() => navigate("/auth/sign-in"), 3000);
  } else {
    setError(data.message || "Lỗi khi đặt lại mật khẩu.");
  }
} catch {
  setError("Lỗi kết nối máy chủ.");
}
};

if (!isTokenValid) {
return (
<div className="flex items-center justify-center min-h-screen">
<Typography color="red" variant="h5">{error}</Typography>
</div>
);
}

return (
<section className="flex justify-center items-center min-h-screen bg-gray-100">
<Card className="p-6 w-full max-w-md">
<Typography variant="h4" className="text-center mb-4">Đặt lại mật khẩu</Typography>
<form onSubmit={handleSubmit} className="flex flex-col gap-4">
<div>
<label htmlFor="password" className="block mb-1 font-medium">Mật khẩu mới</label>
<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
</div>
<div>
<label htmlFor="confirm" className="block mb-1 font-medium">Xác nhận mật khẩu</label>
<Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
</div>
{error && <Typography variant="small" color="red">{error}</Typography>}
{success && <Typography variant="small" color="green">{success}</Typography>}
<Button type="submit" fullWidth>Đặt lại mật khẩu</Button>
</form>
</Card>
</section>
);
}

export default ResetPassword;