export default function DieuKhoanDieuKien() {
  const html = `
  <header class="bg-green-700 text-white py-6 px-4 shadow">
    <div class="max-w-4xl mx-auto text-center">
      <div class="text-4xl mb-2">🌾</div>
      <h1 class="text-3xl font-bold">ĐIỀU KHOẢN &amp; ĐIỀU KIỆN</h1>
      <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
    </div>
  </header>

  <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
    <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
        <p>Điều khoản này áp dụng cho ứng dụng <strong>Farm Talk </strong>(sau đây gọi là “Ứng dụng”), được phát triển bởi <strong>Amazing Tech</strong> (sau đây gọi là “Nhà cung cấp dịch vụ”) như một dịch vụ miễn phí. Ứng dụng được phát hành trên cả hai nền tảng <strong>Android và iOS</strong>, thông qua <strong>Google Play Store</strong> và <strong>Apple App Store.</strong></p>
      </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">1. Chấp thuận điều khoản</h2>
      <p>Bằng việc tải xuống hoặc sử dụng Ứng dụng, bạn đã đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>
      <p>Người dùng phải đồng ý với Điều khoản này tại thời điểm đăng ký tài khoản và sử dụng dịch vụ của Farm Talk.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">2. Quyền sở hữu trí tuệ</h2>
      <p>Mọi mã nguồn, nội dung, logo, giao diện và tài nguyên liên quan đến ứng dụng đều thuộc quyền sở hữu của Nhà cung cấp dịch vụ. 
      Mọi hành vi sao chép, chỉnh sửa, tái sử dụng hay khai thác các tài sản trí tuệ này nếu không có văn bản cho phép đều vi phạm <strong>Luật 
      sở hữu trí tuệ.</strong></p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">3. Phí và thay đổi dịch vụ</h2>
      <p>Ứng dụng hiện được cung cấp miễn phí. Tuy nhiên, Nhà cung cấp dịch vụ có quyền thay đổi mô hình kinh doanh và/hoặc tính phí cho các tính năng nâng cao trong tương lai, với thông báo rõ ràng đến người dùng.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">4. Dữ liệu cá nhân</h2>
      <p>Thông tin thu thập tuân theo <a href="/chinh-sach/bao-mat" class="hover:underline text-blue-500"> Chính Sách Bảo Mật </a> và <a href="/chinh-sach/tao-trang" class="hover:underline text-blue-500"> Chính Sách Tạo Trang Trại </a> nếu áp dụng.</p>
      <p>Dữ liệu phục vụ cho đăng ký, hiển thị, tương tác, cá nhân hóa trải nghiệm.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">5. Sử dụng dịch vụ và thiết bị</h2>
      <p>Người dùng chịu trách nhiệm với thiết bị cá nhân và kết nối mạng khi sử dụng ứng dụng.</p>
      <p>Ứng dụng có thể không hoạt động bình thường nếu thiết bị bị root, jailbreak, lỗi phần cứng, hết pin hoặc không có kết nối mạng ổn định.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">6. Bên thứ ba</h2>
      <p>Ứng dụng có thể sử dụng các dịch vụ bên thứ ba như:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Google Play Services (Android).</li>
        <li>Apple App Store Services (iOS).</li>
      </ul>
      <p>Mỗi bên thứ ba có chính sách và điều khoản riêng, và chúng tôi <strong> không chịu trách nhiệm</strong> cho các nội dung, dữ liệu hoặc hành vi xử lý từ các dịch vụ này.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">7. Kết nối và chi phí dữ liệu</h2>
      <p>Ứng dụng yêu cầu internet để hoạt động. Người dùng tự chịu chi phí liên quan đến dữ liệu di động hoặc roaming khi truy cập ngoài Wi-Fi.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">8. Quy tắc cộng đồng</h2>
      <p>Người dùng không được đăng tải hoặc chia sẻ các nội dung:</p>
      <ul class="list-disc list-inside ml-4 space-y-1">
        <li>Khiêu dâm, bạo lực, phản cảm.</li>
        <li>Kỳ thị, thù ghét, phân biệt đối xử.</li>
        <li>Tin giả, lừa đảo, spam.</li>
        <li>Vi phạm quyền riêng tư hoặc bản quyền.</li>
      </ul>
      <p>Ứng dụng có quyền cảnh cáo, ẩn nội dung, khóa tài khoản hoặc thông báo cơ quan chức năng nếu vi phạm pháp luật.</p>
      <p class="mt-4 "><strong>Tham khảo thêm:</strong> <a href="/chinh-sach/cong-dong" class="hover:underline text-blue-500">Chính sách Cộng đồng FarmTalk.</a></p>
    
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">9. Kiểm duyệt nội dung</h2>
      <p>Ứng dụng áp dụng kiểm duyệt thủ công và tự động:</p>
      <ul class="list-disc list-inside ml-4 space-y-1">
        <li><strong>Video:</strong> Tất cả video do người dùng đăng sẽ được xét duyệt trước khi công khai.</li>
        <li><strong>Chat:</strong> Dùng kết hợp AI & thuật toán chống spam</li>
        <ul class="ml-6 space-y-1">
          <li>Gửi quá nhanh (&lt;1.5s): chặn và hiển thị “Gửi quá nhanh”.</li>
          <li>Gửi nội dung giống nhau: chặn “Không gửi tin nhắn lặp lại”.</li>
          <li>Chứa từ ngữ cấm: chặn và cảnh báo “Nội dung không phù hợp”.</li>
        </ul>
      </ul>
        <p class="mt-4">Hệ thống kiểm duyệt tự động bằng AI liên tục cập nhật danh sách từ khóa <strong>cấm.</strong></p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">10. Cơ chế báo cáo và xử lý vi phạm</h2>
      <p>Người dùng có thể <strong> báo cáo nội dung </strong> hoặc <strong>người dùng </strong> vi phạm bằng tính năng "Báo cáo" trong ứng dụng. Tùy mức độ vi phạm, có thể:</p>
      <ul class="list-disc list-inside ml-4 space-y-1">
        <li>Cảnh cáo.</li>
        <li>Ẩn hoặc xóa nội dung.</li>
        <li>Khóa tạm thời hoặc vĩnh viễn tài khoản.</li>
      </ul>
      <p class="mt-4">🔗 Mức xử lý vi phạm được quy định chi tiết trong <a href="/chinh-sach/cong-dong" class="hover:underline text-blue-500"> Chính sách Cộng đồng.</a></p>
    </section>

    <section>
  <h2 class="text-xl font-semibold text-green-900 mb-2">11. Hệ thống điểm và cấp bậc người dùng</h2>

  <p>Người dùng được cộng điểm khi tương tác:</p>
  <table class="w-full text-left mt-2 border-2 border-gray-600">
    <thead>
      <tr class="bg-green-100">
        <th class="border-2 border-gray-600 px-2 py-1">Hành động</th>
        <th class="border-2 border-gray-600 px-2 py-1">Điểm thưởng</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Thích bài viết/video</td>
        <td class="border-2 border-gray-600 px-2 py-1">+1</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Bình luận</td>
        <td class="border-2 border-gray-600 px-2 py-1">+1</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Tạo bài viết</td>
        <td class="border-2 border-gray-600 px-2 py-1">+2</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Tạo video</td>
        <td class="border-2 border-gray-600 px-2 py-1">+3</td>
      </tr>
    </tbody>
  </table>

  <p class="mt-4 font-semibold">Cấp bậc theo điểm:</p>
  <table class="w-full text-left mt-2 border-2 border-gray-600">
    <thead>
      <tr class="bg-green-100">
        <th class="border-2 border-gray-600 px-2 py-1">Cấp bậc</th>
        <th class="border-2 border-gray-600 px-2 py-1">Điểm</th>
        <th class="border-2 border-gray-600 px-2 py-1">Thời lượng tối đa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Hạt Giống Thần</td>
        <td class="border-2 border-gray-600 px-2 py-1">0–499</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa 1 phút</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Chậu Cây Tiên</td>
        <td class="border-2 border-gray-600 px-2 py-1">500–999</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa 2 phút</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Trang Trại Huyền Thoại</td>
        <td class="border-2 border-gray-600 px-2 py-1">1000–1899</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa 3 phút</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Cánh Đồng Kỵ Sĩ</td>
        <td class="border-2 border-gray-600 px-2 py-1">1900–2999</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa 5 phút</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Vườn Sạch Chiến Binh</td>
        <td class="border-2 border-gray-600 px-2 py-1">3000–4999</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa 7 phút</td>
      </tr>
      <tr>
        <td class="border-2 border-gray-600 px-2 py-1">Rừng Nguyên Sinh</td>
        <td class="border-2 border-gray-600 px-2 py-1">5000+</td>
        <td class="border-2 border-gray-600 px-2 py-1">Tối đa &gt;10 phút</td>
      </tr>
    </tbody>
  </table>
</section>


    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">12. Ngừng cung cấp</h2>
      <p>Nhà cung cấp có thể ngừng hoặc thay đổi ứng dụng mà không cần báo trước. Khi đó:</p>
      
        <p>Người dùng không thể tiếp tục sử dụng.</p>
        <p>Mọi quyền đã cấp sẽ chấm dứt.</p>
      
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">13. Thay đổi điều khoản</h2>
      <p>Điều khoản có thể được cập nhật bất kỳ lúc nào. Việc tiếp tục sử dụng ứng dụng là bạn đã đồng ý với điều khoản mới.</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-green-900 mb-2">14. Liên hệ</h2>
      <p>Mọi câu hỏi, khiếu nại hoặc góp ý vui lòng gửi về email: 
        <a href="mailto:farmtalk.help@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a>
      </p>
    </section>
  </main>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
