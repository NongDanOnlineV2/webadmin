export default function ChinhSachCookie() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">🍪</div>
        <h1 class="text-3xl font-bold">CHÍNH SÁCH COOKIE</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-6 space-y-8">
      <section>
        <h2 class="text-xl font-semibold mb-2">1. Cookie là gì?</h2>
        <p>Cookie là các tệp nhỏ được lưu trên thiết bị để ghi nhớ thông tin.</p>
      </section>
      <section>
        <h2 class="text-xl font-semibold mb-2">2. Mục đích sử dụng Cookie</h2>
        <p>Farm Talk dùng Cookie để:</p>
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Nhớ thông tin đăng nhập</li>
          <li>Phân tích lưu lượng người dùng</li>
          <li>Cá nhân hóa trải nghiệm</li>
        </ul>
      </section>
      <section>
        <h2 class="text-xl font-semibold mb-2">3. Quản lý Cookie</h2>
        <p>Bạn có thể tắt Cookie trong trình duyệt. Tuy nhiên, một số tính năng có thể bị hạn chế.</p>
      </section>
    </main>

    <footer class="bg-green-100 text-center py-4 mt-10 border-t border-green-300">
      <p class="text-sm">© 2025 Farm Talk | Chính sách Cookie</p>
    </footer>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
