import React, { useRef, useState } from "react";
import {
  Card, Input, Checkbox, Button, Typography, Radio
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useMaterialTailwindController, setAuthStatus } from "@/context";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [env, setEnv] = useState("dev");
  const navigate = useNavigate();
  const [, dispatch] = useMaterialTailwindController();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [useDefaultApi, setUseDefaultApi] = useState(true);
  const [customApiUrl, setCustomApiUrl] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập Email");
      emailRef.current?.focus();
      return;
    }

    if (!password.trim()) {
      setPasswordError("Vui lòng nhập Password");
      passwordRef.current?.focus();
      return;
    }

    try {
      const BASE_URL = useDefaultApi
        ? "http://103.48.193.165:5222"
        : customApiUrl.trim();
      if (!BASE_URL) {
        alert("Vui lòng nhập URL API tùy chỉnh.");
        return;
      }
      localStorage.setItem("apiBaseUrl", BASE_URL);
     console.log(BASE_URL)
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const roles = data.user?.role || [];
        const isAllowed = roles.includes("Admin") || roles.includes("Staff");
        if(isAllowed){
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          setAuthStatus(dispatch, true);
          navigate("/dashboard/home");
        }else {
        alert("Bạn không có quyền đăng nhập.");
      } 
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Không thể kết nối tới máy chủ, thử lại sau");
    }
  };


  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
              inputRef={emailRef}
            />
            {emailError && (
              <Typography variant="small" className="text-red-500 -mt-4">{emailError}</Typography>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
              inputRef={passwordRef}
            />
            {passwordError && (
              <Typography variant="small" className="text-red-500 -mt-4">{passwordError}</Typography>
            )}
          </div>

          <div className="mt-4">
            <Typography variant="small" className="font-medium mb-2">
              Chọn môi trường API:
            </Typography>
            <div className="flex flex-col gap-2">
              <Checkbox
                label="Sử dụng API mặc định (Dev)"
                checked={useDefaultApi}
                onChange={() => setUseDefaultApi(!useDefaultApi)}
              />
              {!useDefaultApi && (
                <>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Nhập URL API tùy chỉnh:
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="https://your-custom-api.com"
                    value={customApiUrl}
                    onChange={(e) => setCustomApiUrl(e.target.value)}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </>
              )}
            </div>
          </div>

          <Button className="mt-6" type="submit" fullWidth>Sign In</Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            {/* <Checkbox
              label={
                <Typography variant="small" color="gray" className="flex items-center justify-start font-medium">
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            /> */}
      <div className="text-center mt-2">
  <Typography variant="small" className="font-medium text-gray-900">
    <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
      Quên mật khẩu?
    </Link>
  </Typography>
</div>
 <Typography variant="small" className="font-medium text-gray-900"> 
  <Link to="/auth/reset-password" className="text-sm text-blue-500 hover:underline"> Đổi mật khẩu </Link> 
  </Typography> 

          </div>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
      </div>
    </section>
  );
}

export default SignIn;
