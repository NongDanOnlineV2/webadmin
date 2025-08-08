import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPasswordWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      navigate(`/auth/reset-password?token=${token}`, { replace: true });
    } else {
      navigate("/auth/sign-in", { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default ResetPasswordWrapper;
