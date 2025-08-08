import React from "react";
import { Outlet } from "react-router-dom";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // thêm icon

function Public() {
  return (
    <div className="bg-green-50 text-gray-800 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-900 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Farm Talk logo */}
          <h1 className="text-2xl font-bold">
            <a href="" className="hover:underline">Farm Talk</a>
          </h1>

          {/* Chính Sách Menu Dropdown */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                variant="text"
                className="text-white p-0 hover:underline normal-case text-sm sm:text-base flex items-center gap-1"
              >
                Chính Sách
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem>
                <a href="/chinh-sach/bao-mat" className="hover:underline">Chính Sách Bảo Mật</a>
              </MenuItem>
              <MenuItem>
                <a href="/chinh-sach/cookie" className="hover:underline">Chính Sách Cookie</a>
              </MenuItem>
              <MenuItem>
                <a href="/chinh-sach/dieu-khoan" className="hover:underline">Điều Khoản & Điều Kiện</a>
              </MenuItem>
              <MenuItem>
                <a href="/chinh-sach/tao-trang" className="hover:underline">Chính Sách Tạo Trang Trại</a>
              </MenuItem>
              <MenuItem>
                <a href="/chinh-sach/cong-dong" className="hover:underline">Chính Sách Cộng Đồng</a>
              </MenuItem>
              <MenuItem>
                <a href="/chinh-sach/tre-em" className="hover:underline">Chính Sách Bảo Vệ Trẻ Em</a>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </header>

      {/* Nội dung trang */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-100 text-center py-4 mt-10 border-t border-green-300 text-sm">
        © 2025 Farm Talk | Chính sách hiệu lực từ 31/07/2025
      </footer>
    </div>
  );
}

Public.displayName = "/src/layouts/Public.jsx";
export default Public;
