import React, { useState, useRef } from "react";
import {
  Card, Input, Button, Typography
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const BASE_URL = localStorage.getItem("apiBaseUrl") || "https://api-ndolv2.nongdanonline.cc";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMessage("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập Email");
      emailRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Đã gửi mail khôi phục! Vui lòng kiểm tra hộp thư.");
      } else {
        setEmailError(data.message || "Gửi yêu cầu thất bại.");
      }
    } catch (err) {
      console.error("Forgot Password error:", err);
      setEmailError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4 justify-center items-center min-h-screen">
      <Card color="white" shadow={true} className="p-6 w-full max-w-md">
        <Typography variant="h4" color="blue-gray" className="text-center mb-4">
          Quên mật khẩu
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputRef={emailRef}
          />
          {emailError && (
            <Typography className="text-red-500 text-sm">{emailError}</Typography>
          )}
          {message && (
            <Typography className="text-green-600 text-sm">{message}</Typography>
          )}
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Đang gửi..." : "Gửi email khôi phục"}
          </Button>
          <Typography variant="small" className="text-center mt-2">
            <Link to="/auth/sign-in" className="text-blue-500 hover:underline">
              Quay lại đăng nhập
            </Link>
          </Typography>
        </form>
      </Card>
    </section>
  );
}

export default ForgotPassword;
