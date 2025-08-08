import React, { useEffect, useState } from "react";


const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const BaseUrl = (() => {
  const host = window.location.hostname;

  if (host === "webadmin-dev.vercel.app") {
    return "https://api-ndol-v2-prod.nongdanonline.cc";
  } else {
 
    return "https://api-ndolv2.nongdanonline.cc";
  }
})();



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email") || "";
    const otpFromUrl = params.get("otp") || "";

    setEmail(emailFromUrl);
    setOtp(otpFromUrl);

    if (!emailFromUrl || !otpFromUrl) {
      setStatus("❌ Thiếu thông tin email hoặc OTP từ URL.");
    }
  }, []);

  const handleVerify = async () => {
    if (!email || !otp) {
      setStatus("❌ Thiếu thông tin email hoặc OTP.");
      return;
    }

    setLoading(true);
    setStatus("🔄 Đang xác thực...");
    try {
      const res = await fetch(`${BaseUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Tài khoản đã xác thực thành công! Vui lòng quay về app để đăng nhập.");
      } else {
        setStatus(`❌ Xác thực thất bại: ${data.message || "OTP không hợp lệ hoặc đã hết hạn."}`);
      }
    } catch (err) {
      setStatus("❌ Lỗi kết nối đến server.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <img
          src="/img/LogoCut2.png"
          alt="FarmTalk Logo"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Xác thực tài khoản
        </h2>

        <div className="mb-4 text-sm">
          <strong>Email:</strong> {email || "(Không có email)"}
        </div>
        <div className="mb-4 text-sm">
          <strong>OTP:</strong> {otp || "(Không có OTP)"}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 text-white rounded-md font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00C86F] hover:bg-green-700"
          }`}
        >
          {loading ? "Đang xác thực..." : "Xác thực tài khoản"}
        </button>

        {status && (
          <p
            className={`mt-4 text-center font-medium ${
              status.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
