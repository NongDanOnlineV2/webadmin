// Đảm bảo luôn lấy giá trị mới nhất từ localStorage mỗi lần gọi API
export function BaseUrl() {
  return localStorage.getItem("apiBaseUrl") || "https://api-ndolv2.nongdanonline.cc";
}