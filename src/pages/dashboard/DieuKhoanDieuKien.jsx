export default function DieuKhoanDieuKien() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
    <div class="max-w-4xl mx-auto text-center">
      <div class="text-4xl mb-2">🌾</div>
      <h1 class="text-3xl font-bold">ĐIỀU KHOẢN &amp; ĐIỀU KIỆN</h1>
      <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
    </div>
  </header>

  <!-- Main content -->
  <main class="max-w-4xl mx-auto p-6 space-y-8">
    <section>
      <p>
        Điều khoản này áp dụng cho ứng dụng <strong>Farm Talk</strong> (sau đây gọi là “Ứng dụng”), được phát triển bởi <strong>Amazing Tech</strong> (sau đây gọi là “Nhà cung cấp dịch vụ”) như một dịch vụ miễn phí. Ứng dụng được phát hành trên cả hai nền tảng Android và iOS, thông qua Google Play Store và Apple App Store.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">1. Chấp thuận điều khoản</h2>
      <p>Bằng việc tải xuống hoặc sử dụng Ứng dụng, bạn đã đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Không được sao chép, chỉnh sửa hoặc dịch mã nguồn ứng dụng.</li>
        <li>Không được tạo phiên bản phái sinh hoặc sử dụng trái phép nội dung, thương hiệu.</li>
        <li>Tất cả quyền sở hữu trí tuệ thuộc về Nhà cung cấp dịch vụ.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">2. Sửa đổi và phí dịch vụ</h2>
      <p>Nhà cung cấp dịch vụ có thể thay đổi nội dung hoặc thu phí bất kỳ lúc nào. Nếu có phí, bạn sẽ được thông báo rõ ràng.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">3. Dữ liệu cá nhân và bảo mật thiết bị</h2>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Dữ liệu bạn cung cấp được sử dụng để cung cấp dịch vụ.</li>
        <li>Bạn chịu trách nhiệm bảo mật thiết bị và quyền truy cập.</li>
        <li>Không khuyến khích root/jailbreak vì gây mất an toàn.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">4. Dịch vụ bên thứ ba</h2>
      <p>Ứng dụng có thể sử dụng dịch vụ bên thứ ba như:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Google Play Services (Android)</li>
        <li>Apple App Store Services (iOS)</li>
      </ul>
      <p>Chúng tôi không chịu trách nhiệm về nội dung hoặc hành vi xử lý của các bên thứ ba này.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">5. Kết nối internet và chi phí</h2>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Ứng dụng yêu cầu kết nối internet.</li>
        <li>Không chịu trách nhiệm nếu hoạt động bị gián đoạn do kết nối yếu.</li>
        <li>Bạn tự chịu chi phí data, chuyển vùng nếu có.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">6. Trách nhiệm sử dụng và nội dung người dùng</h2>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Bạn chịu trách nhiệm cho nội dung mình đăng.</li>
        <li>Hành vi bị cấm: nội dung phản cảm, xâm phạm quyền riêng tư, spam, quấy rối...</li>
        <li>Chúng tôi có quyền xóa nội dung, khóa tài khoản, báo cơ quan chức năng nếu cần.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">7. Cập nhật và ngừng dịch vụ</h2>
      <p>Chúng tôi có thể cập nhật ứng dụng bất cứ lúc nào và bạn đồng ý cài bản cập nhật để tiếp tục sử dụng.</p>
      <p>Chúng tôi có quyền ngừng dịch vụ mà không cần báo trước. Khi đó:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Mọi quyền và giấy phép chấm dứt.</li>
        <li>Bạn cần ngừng sử dụng và gỡ ứng dụng.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">8. Thay đổi điều khoản</h2>
      <p>Điều khoản có thể được cập nhật định kỳ. Việc tiếp tục sử dụng đồng nghĩa bạn đồng ý với điều khoản mới.</p>
      <p><strong>Hiệu lực từ:</strong> 15/07/2025</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">9. Liên hệ</h2>
      <p>Mọi thắc mắc hoặc góp ý, vui lòng gửi về: 
        <a href="mailto:farmtalk.help@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a>
      </p>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-green-100 text-center py-4 mt-10 border-t border-green-300">
    <p class="text-sm">© 2025 Farm Talk | Amazing Tech</p>
  </footer>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
