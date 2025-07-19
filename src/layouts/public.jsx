import React from "react";
import { Outlet } from "react-router-dom";

function Public() {
  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <header class="bg-green-900 text-white py-4 shadow">
        <div class="max-w-5xl mx-auto flex justify-between items-center px-4">
            <h1 class="text-2xl font-bold"><a href="chinh_sach.html" class="hover:underline">Farm Talk</a></h1>
            <nav class="flex space-x-4">
            <a href="/chinh-sach/bao-mat" class="hover:underline">Chính Sách Bảo Mật</a>
            <a href="/chinh-sach/cookie" class="hover:underline">Chính Sách Cookie</a>
            <a href="/chinh-sach/dieu-khoan" class="hover:underline">Điều Khoản & Điều Kiện</a>
            </nav>
        </div>
    </header>

      {/* Nội dung trang */}
      <main>
        <Outlet />
      </main>

      <footer class="bg-green-100 text-center py-4 mt-10 border-t border-green-300">
        <p class="text-sm">© 2025 Farm Talk | Chính sách hiệu lực từ 15/07/2025</p>
    </footer>
    </div>
  );
}
Public.displayName = "/src/layouts/Public.jsx";
export default Public;
