export default function ChinhSachCookie() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">🌾</div>
        <h1 class="text-3xl font-bold">CHÍNH SÁCH COOKIE</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
    <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
        <p>Chính sách này áp dụng cho ứng dụng Farm Talk (sau đây gọi là “Ứng dụng”), được phát triển bởi Amazing Tech (sau đây gọi là “Nhà cung cấp dịch vụ”), như một dịch vụ miễn phí. Ứng dụng được phát hành trên cả hai nền tảng Android và iOS. Việc tạo trang trại được xem là đồng ý và cam kết tuân thủ theo các điều khoản nêu tại văn bản này.</p>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">1. Mục đích sử dụng</h2>
        <p>Đảm bảo trang web và dịch vụ vận hành chính xác.</p>
        <p>Ghi nhớ lựa chọn của người dùng như ngôn ngữ, phiên đăng nhập.</p>
        <p>Phân tích hành vi truy cập và cải thiện hiệu suất dịch vụ.</p>
        <p>Cung cấp nội dung phù hợp và có liên quan tới người dùng (nếu có).</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">2. Loại cookie và công nghệ theo dõi</h2>
        <p>Cookie nội bộ do hệ thống Farm Talk quản lý (localStorage, sessionStorage).</p>
        <p>Cookie và trình theo dõi từ bên thứ ba như: Google Analytics, Meta Pixel, Firebase, Mailchimp...</p>
        <p>Các bên thứ ba này có thể sử dụng cookie riêng của họ theo chính sách của từng bên.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">3. Quản lý cookie</h2>
        <p>Thiết lập trong trình duyệt như Chrome, Safari, Firefox, Edge...</p>
        <p>Tắt quảng cáo cá nhân hóa trong cài đặt thiết bị.</p>
        <p>Điều chỉnh quyền riêng tư trực tiếp trên trang web (nếu có cung cấp).</p>
        <p><strong>Lưu ý:</strong> Việc tắt cookie có thể ảnh hưởng đến trải nghiệm và một số chức năng của dịch vụ.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">4. Hệ quả khi từ chối cookie</h2>
        <p>Nếu bạn từ chối sử dụng cookie, một số nội dung hoặc chức năng có thể không hiển thị đúng hoặc không hoạt động.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">5. Liên hệ</h2>
        <p>Nếu bạn có bất kỳ thắc mắc nào liên quan đến việc sử dụng cookie, vui lòng liên hệ với chúng tôi qua địa chỉ:</p>
        <p class="mt-1">
          Email:
          <a href="mailto:farmtalk.help@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a>
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">6. Cập nhật chính sách</h2>
        <p>Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được công bố công khai trên trang web. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc <strong>chấp thuận chính sách mới.</strong> </p>
      </section>
    </main>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
