export default function DieuKhoanDieuKien() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">📄</div>
        <h1 class="text-3xl font-bold">ĐIỀU KHOẢN & ĐIỀU KIỆN</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-6 space-y-8">
      <section>
        <h2 class="text-xl font-semibold mb-2">1. Chấp thuận điều khoản</h2>
        <p>Bằng việc tải xuống hoặc sử dụng ứng dụng, bạn đã đồng ý với các điều khoản này.</p>
      </section>
      <section>
        <h2 class="text-xl font-semibold mb-2">2. Sửa đổi dịch vụ</h2>
        <p>Farm Talk có thể thay đổi, ngừng hoặc thu phí dịch vụ với thông báo trước.</p>
      </section>
      <section>
        <h2 class="text-xl font-semibold mb-2">3. Quyền và trách nhiệm</h2>
        <p>Bạn có trách nhiệm tuân thủ pháp luật khi sử dụng ứng dụng. Mọi vi phạm sẽ bị xử lý.</p>
      </section>
    </main>

    <footer class="bg-green-100 text-center py-4 mt-10 border-t border-green-300">
      <p class="text-sm">© 2025 Farm Talk | Điều khoản & Điều kiện</p>
    </footer>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
