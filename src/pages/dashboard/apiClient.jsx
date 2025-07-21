// apiClient.js
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  // Gắn token vào header
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token hết hạn hoặc không có quyền
      alert("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token"); // Xoá token cũ
      window.location.href = "/login"; // Chuyển về trang login
      return;
    }

    if (!response.ok) {
      // Các lỗi khác (404, 500,…)
      throw new Error(`Lỗi API: ${response.status}`);
    }

    return response.json(); // Trả về JSON
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}
