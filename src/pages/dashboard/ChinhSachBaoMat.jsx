export default function ChinhSachBaoMat() {
  const html = `
    <!-- Header -->
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">🌾</div>
        <h1 class="text-3xl font-bold">CHÍNH SÁCH BẢO MẬT</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>

    <!-- Nội dung bạn đã copy ở trên... -->
    <!-- Bạn có thể giữ nguyên nội dung chính sách thu thập thông tin tại đây -->

    <!-- Footer -->
    <footer class="bg-green-100 text-center py-4 mt-10 border-t border-green-300">
      <p class="text-sm">© 2025 Farm Talk | Chính sách hiệu lực từ 15/07/2025</p>
    </footer>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
