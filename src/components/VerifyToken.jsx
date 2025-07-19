// pages/verify-token.jsx hoặc components/VerifyToken.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Next.js: useRouter()

export default function VerifyToken() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`https://api-ndolv2.nongdanonline.cc/verify-token?token=${token}`);// chưa có verify-token file chưa xong
        if (!res.ok) throw new Error("Token không hợp lệ");
        setTimeout(() => navigate(`/reset-password?token=${token}`), 1000); // chuyển sau 1s
      } catch (err) {
        setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) return <p>Đang kiểm tra token...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <p>Đang chuyển hướng...</p>;
}
