export default function ChinhSachCongDong() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">🌾</div>
        <h1 class="text-3xl font-bold">CHÍNH SÁCH CỘNG ĐỒNG</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>
    <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
        <p>Chính sách Cộng đồng này nhằm thiết lập môi trường an toàn, tích cực và minh bạch cho tất cả người dùng FarmTalk. Việc sử dụng ứng dụng đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý tuân thủ các quy tắc dưới đây.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">1. Quy tắc hành xử chung</h2>
        
          <p>Góp ý cải tiến, chia sẻ kinh nghiệm hữu ích về nông nghiệp.</p>
          <p>Nội dung mang giá trị giáo dục, truyền cảm hứng sống xanh.</p>
          <p>Ngôn ngữ lịch sự, tôn trọng người khác, không xúc phạm, kỳ thị hay gây hấn.</p>
          <p>Không đăng tải thông tin sai lệch, giật gân, tin giả hoặc spam.</p>
          <p>Không chia sẻ nội dung bạo lực, khiêu dâm, vi phạm pháp luật.</p>
          <p>Không xâm phạm quyền riêng tư của người khác.</p>

      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">2. Phạm vi áp dụng</h2>
        <p>Chính sách áp dụng cho toàn bộ người dùng FarmTalk, bao gồm:</p>

          <p>Người dùng thường (Customer)</p>
          <p>Người dùng có xác thực trang trại (Farmer)</p>
          <p>Quản trị viên, kiểm duyệt viên, kỹ thuật viên (Admin/Staff)</p>

      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">3. Nội dung được phép & nghiêm cấm</h2>

        <table class="w-full text-left border-2 border-green-700">
            <thead class="bg-green-100 text-green-900">
            <tr>
                <th class="p-2 border-2 border-green-700">Loại nội dung</th>
                <th class="p-2 border-2 border-green-700">Chi tiết</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="p-2 border-2 border-green-700 text-green-800 font-semibold">ĐƯỢC PHÉP</td>
                <td class="p-2 border-2 border-green-700 text-green-900">
                <ul class=" ml-4 space-y-1">
                    <li>Nhật ký canh tác, hướng dẫn kỹ thuật.</li>
                    <li>Câu chuyện thực tế từ nông trại, video nuôi trồng.</li>
                    <li>Nội dung sáng tạo vì cộng đồng, thân thiện môi trường.</li>
                </ul>
                </td>
            </tr>
            <tr>
                <td class="p-2 border-2 border-green-700 text-red-700 font-semibold">BỊ CẤM</td>
                <td class="p-2 border-2 border-green-700 text-red-700">
                <ul class=" ml-4 space-y-1">
                    <li>Bạo lực, đồi trụy, chính trị nhạy cảm.</li>
                    <li>Tin giả, vi phạm bản quyền.</li>
                    <li>Buôn bán trái phép: động vật hoang dã, chất cấm, vũ khí...</li>
                </ul>
                </td>
            </tr>
            </tbody>
        </table>
        </section>
      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">4. Kiểm duyệt & xử lý vi phạm</h2>
        <p class="font-bold">A. Tự động kiểm duyệt tin nhắn bằng AI:</p>
        
          <p>Gửi quá nhanh &lt; 1.5 giây → “Gửi quá nhanh”.</p>
          <p>Gửi trùng nội dung → “Không gửi tin nhắn lặp lại”.</p>
          <p>Có từ cấm → “Nội dung không phù hợp”.</p>
        
        <p class="font-bold mt-4">B. Báo cáo & xử lý thủ công:</p>
          <p>Người dùng có thể nhấn nút <strong>“Báo cáo”</strong> trên bài viết / người dùng / video.</p>
          <p>Đội ngũ Admin sẽ <strong>kiểm tra & xử lý vi phạm</strong> theo các bước: <br />Ẩn nội dung → Gửi cảnh báo → Tạm khóa hoặc <Strong>xóa vĩnh viễn tài khoản</Strong> nếu vi phạm lặp lại.</p>
        
        <p class="font-bold mt-4">C. Video:</p>
        
          <p><strong>Chỉ người dùng vai trò Farmer có trang trại xác thực mới được đăng video.</strong></p>
          <p>Video upload sẽ được <strong>duyệt thủ công</strong>, đảm bảo đúng nội dung.</p>
          <p>Hệ thống sẽ <strong>từ chối</strong> nếu: định dạng không hợp lệ (.mp4), Dung lượng vượt quá 250MB, Thời lượng vượt giới hạn cấp bậc người dùng.</p>
        
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">5. Xử lý vi phạm</h2>
        <table class="w-full text-left border-2 border-green-700">
          <thead class="bg-green-100 text-green-900">
            <tr>
              <th class="p-2 border-2 border-green-700">Mức độ</th>
              <th class="p-2 border-2 border-green-700">Hình thức xử lý</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border-2 border-green-700">Nhẹ</td>
              <td class="p-2 border-2 border-green-700">Xóa nội dung, gửi cảnh báo</td>
            </tr>
            <tr>
              <td class="p-2 border-2 border-green-700">Tái phạm</td>
              <td class="p-2 border-2 border-green-700">Tạm khóa quyền, hạ cấp bậc</td>
            </tr>
            <tr>
              <td class="p-2 border-2 border-green-700">Nặng</td>
              <td class="p-2 border-2 border-green-700">Khóa tài khoản vĩnh viễn</td>
            </tr>
            <tr>
              <td class="p-2 border-2 border-green-700">Nghiêm trọng</td>
              <td class="p-2 border-2 border-green-700">Báo cáo cơ quan chức năng</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">6. Chính sách điểm thưởng & phân hạng</h2>
        <table class="w-full text-left border-2 border-green-700 mb-4">
          <thead class="bg-green-100">
            <tr>
              <th class="p-2 border-2 border-green-700">Hành động</th>
              <th class="p-2 border-2 border-green-700">Điểm thưởng</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border-2 border-green-700">Thích bài viết/video</td><td class="p-2 border-2 border-green-700">+1</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Bình luận</td><td class="p-2 border-2 border-green-700">+1</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Tạo bài viết</td><td class="p-2 border-2 border-green-700">+2</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Đăng video (Farmer)</td><td class="p-2 border-2 border-green-700">+3</td></tr>
          </tbody>
        </table>

        <table class="w-full text-left border-2 border-green-700">
          <thead class="bg-green-100">
            <tr>
              <th class="p-2 border-2 border-green-700">Cấp bậc</th>
              <th class="p-2 border-2 border-green-700">Điểm</th>
              <th class="p-2 border-2 border-green-700">Giới hạn video</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border-2 border-green-700">Hạt Giống Thần</td><td class="p-2 border-2 border-green-700">0 – 499</td><td class="p-2 border-2 border-green-700">1 phút</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Chậu Cây Tiên</td><td class="p-2 border-2 border-green-700">500 – 999</td><td class="p-2 border-2 border-green-700">2 phút</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Trang Trại Huyền Thoại</td><td class="p-2 border-2 border-green-700">1000 – 1899</td><td class="p-2 border-2 border-green-700">3 phút</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Cánh Đồng Kỵ Sĩ</td><td class="p-2 border-2 border-green-700">1900 – 2999</td><td class="p-2 border-2 border-green-700">5 phút</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Vườn Sạch Chiến Binh</td><td class="p-2 border-2 border-green-700">3000 – 4999</td><td class="p-2 border-2 border-green-700">7 phút</td></tr>
            <tr><td class="p-2 border-2 border-green-700">Rừng Nguyên Sinh</td><td class="p-2 border-2 border-green-700">5000+</td><td class="p-2 border-2 border-green-700">&gt;10 phút</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">7. Thay đổi điều khoản</h2>
        <p>Điều khoản có thể được cập nhật bất kỳ lúc nào. Người dùng sẽ được thông báo và việc tiếp tục sử dụng ứng dụng được hiểu là đã chấp nhận các điều khoản mới.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">8. Ngừng cung cấp</h2>
        <p>Nhà cung cấp có thể ngừng hoặc thay đổi toàn bộ hay một phần của ứng dụng mà không cần báo trước. Khi đó:</p>
        
          <p>Người dùng sẽ không thể tiếp tục sử dụng dịch vụ.</p>
          <p>Các quyền đã cấp cũng sẽ chấm dứt.</p>
        
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">9. Liên kết chính sách liên quan</h2>
          <p><a href="/chinh-sach/bao-mat" class="text-blue-600 underline">Chính sách Bảo mật</a></p>
          <p><a href="/chinh-sach/dieu-khoan" class="text-blue-600 underline">Điều khoản & Điều kiện</a></p>
          <p><a href="/chinh-sach/tao-trang" class="text-blue-600 underline">Chính sách Tạo Trang trại</a></p>
          <p><a href="/chinh-sach/cookie" class="text-blue-600 underline">Chính sách Cookie</a></p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">10. Liên hệ & hỗ trợ</h2>
        <p>Mọi câu hỏi, khiếu nại hoặc góp ý vui lòng gửi về email: <a href="mailto:farmtalk.help@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a></p>
      </section>
    </main>
  `;

  return (
    <div className="bg-green-50 text-gray-800 font-sans">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
