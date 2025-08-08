export default function ChinhSachBaoMat() {
  const html = `
  <!-- Header -->
  <header class="bg-green-700 text-white py-4 px-3 sm:py-6 sm:px-4 shadow">
    <div class="max-w-3xl mx-auto text-center">
      <div class="text-3xl sm:text-4xl mb-2">🌾</div>
      <h1 class="text-2xl sm:text-3xl font-bold">CHÍNH SÁCH BẢO MẬT</h1>
      <p class="text-sm sm:text-base mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
    </div>
  </header>

  <!-- Main content -->
  <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
  <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
        <p>Chính sách bảo mật này áp dụng cho ứng dụng Farm Talk (sau đây gọi là “Ứng dụng”) trên thiết bị di động, được phát triển bởi Amazing Tech (sau đây gọi là “Nhà cung cấp dịch vụ”) như một dịch vụ miễn phí. Ứng dụng được phát hành trên cả hai nền tảng Android và iOS, thông qua Google Play Store và Apple App Store. Ứng dụng này được cung cấp dưới dạng “nguyên trạng” (AS IS).</p>
      </section>
    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">1. Thu thập thông tin</h2>
      <p>Ứng dụng có thể thu thập các loại thông tin sau trong quá trình bạn sử dụng:</p>
      
        <p><strong>Thông tin cá nhân:</strong> Tên, email, số điện thoại,Ảnh đại diện, ảnh/video tải lên,Nội dung bạn tạo như: bài viết, video, bình luận, tin nhắn...</p>
        <p><strong>Thông tin về Trang trại (áp dụng khi đăng ký Farm):</strong> Tên trang trại, địa chỉ, diện tích, diện tích canh tác, dịch vụ cung cấp, mô hình canh tác, chứng nhận, tags mô tả, hình ảnh trang trại, số điện thoại, zalo,...theo <a href="/chinh-sach/tao-trang" class="hover:underline text-blue-500"> Chính Sách Tạo Trang Trại.</a></p>
      
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">2. Mục đích sử dụng thông tin</h2>
      <p>Thông tin được thu thập để:</p>
      
        <p>Vận hành và duy trì ứng dụng.</p>
        <p>Cải thiện trải nghiệm người dùng.</p>
        <p>Liên hệ hỗ trợ, thông báo cập nhật, khuyến mãi.</p>
        <p>Thực hiện các tính năng xã hội (bài viết, video, bình luận, xếp hạng...).</p>
        <p>Phát hiện và ngăn chặn nội dung vi phạm, spam hoặc hành vi độc hại.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">3. Truy cập từ thiết bị</h2>
      <p>Ứng dụng có thể yêu cầu quyền truy cập vào:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Bộ nhớ ảnh và tệp (để tải hình/video).</li>
        <li>Máy ảnh và micro (tính năng quay/chụp từ ứng dụng).</li>
        <li>Truy cập mạng và thông báo (để kết nối và gửi tin).</li>
      </ul>
      <p class="mt-2">Việc cấp quyền là <strong>tùy chọn </strong>và được thông báo rõ ràng trong hệ thống. Dữ liệu thu thập chỉ dùng để cung cấp chức năng, không được sử dụng ngoài mục đích ứng dụng.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">4. Dịch vụ bên thứ ba</h2>
      <p>Ứng dụng sử dụng các công cụ/dịch vụ từ bên thứ ba:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Google Play Services (Android).</li>
        <li>Apple App Store Services (iOS).</li>
      </ul>
      <p class="mt-2">Các bên thứ ba có thể sử dụng một số thông tin không định danh để phân tích và hỗ trợ hiệu suất ứng dụng. Việc sử dụng dữ liệu tuân theo chính sách của các bên liên quan.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">5. Quyền từ chối (Opt-out)</h2>
      <p>Bạn có thể ngừng chia sẻ dữ liệu cá nhân bằng cách:</p>
      
        <p>Gỡ cài đặt ứng dụng.</p>
        <p>Không tiếp tục sử dụng các tính năng yêu cầu thông tin cá nhân.</p>
        <p><strong>Xóa toàn bộ tài khoản và dữ liệu cá nhân</strong> trực tiếp trên ứng dụng.</p>
      
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">6. Bảo mật thông tin</h2>
      <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản trị để đảm bảo an toàn thông tin, bao gồm:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Mã hóa dữ liệu nhạy cảm.</li>
        <li>Hạn chế truy cập nội bộ.</li>
        <li>Kiểm soát lưu trữ và sao lưu dữ liệu.</li>
      </ul>
      <p class="mt-2">Tuy nhiên, không có hệ thống nào an toàn tuyệt đối. Việc chia sẻ thông tin là có rủi ro và bạn tự chịu trách nhiệm nếu tiết lộ thông tin riêng tư.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">7. Trẻ em</h2>
      <p>Ứng dụng FarmTalk cho phép người dùng dưới <strong>13 tuổi</strong> tham gia, nhưng yêu cầu có sự giám sát, đồng ý rõ ràng từ cha mẹ hoặc người giám hộ hợp pháp.</p>

      <h3 class="mt-4 font-semibold text-green-900">7.1 Điều kiện sử dụng</h3>
      <p>Trẻ em dưới 13 tuổi chỉ được sử dụng ứng dụng khi có sự đồng ý và giám sát của người giám hộ.<br>
        Người giám hộ cần hỗ trợ trong quá trình đăng ký và cấu hình tài khoản, cũng như theo dõi các hoạt động trên ứng dụng.</p>

      <h3 class="mt-4 font-semibold text-green-900">7.2 Thu thập thông tin từ trẻ em</h3>
      <p>Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em mà không có sự đồng ý của người giám hộ.<br>
        Nếu bạn là phụ huynh hoặc người giám hộ và phát hiện trẻ em đã cung cấp thông tin cá nhân cho chúng tôi mà không được phép, bạn có thể xóa toàn bộ tài khoản và dữ liệu cá nhân trực tiếp trên ứng dụng (theo mục 10.3 bên dưới).</p>

      <h3 class="mt-4 font-semibold text-green-900">7.3 Biện pháp bảo vệ & quyền riêng tư</h3>
      <p>Chúng tôi áp dụng các biện pháp rà soát nội dung và kiểm duyệt chặt chẽ nhằm đảm bảo môi trường sử dụng an toàn và lành mạnh cho trẻ em.</p>

      <h3 class="mt-4 font-semibold text-green-900">7.4 Trách nhiệm của người giám hộ</h3>
      <p>Người giám hộ chịu trách nhiệm đối với các hoạt động của trẻ em trên ứng dụng.<br>
        Trong trường hợp có khiếu nại, chúng tôi có thể yêu cầu xác minh mối quan hệ giữa người dùng và người giám hộ.</p>
    </section>


    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">8. Nội dung do người dùng tạo & kiểm duyệt</h2>
      <p>Ứng dụng cho phép bạn tạo nội dung (video, bài viết, bình luận, tin nhắn). Để đảm bảo an toàn và lành mạnh, chúng tôi triển khai:</p>
      <ul class=" list-disc ml-4 mt-2 space-y-2">
        <li> <strong>Duyệt video thủ công:</strong> Tất cả video phải được admin xét duyệt trước khi công khai. Bình luận/bài viết vi phạm sẽ <strong> ẩn, cảnh cáo hoặc khóa.</strong></li>
        <li>
           <strong>Lọc từ khóa tự động</strong> trong chat:
          <ul class="ml-6 mt-1 space-y-1">
            <li><span class="text-green-500">✔</span> Chặn các từ nhạy cảm (thô tục, phân biệt, khiêu dâm…)</li>
            <li>
              <span class="text-green-500">✔</span> Chặn spam:
              <ul class="ml-6 mt-1 space-y-1">
                <li><span class="text-gray-500">•</span> Gửi quá nhanh &lt; 1.5 giây → hiển thị: “Gửi quá nhanh”.</li>
                <li><span class="text-gray-500">•</span> Gửi lặp → “Vui lòng không gửi tin nhắn lặp lại”.</li>
                <li><span class="text-gray-500">•</span> Gửi từ cấm → “Tin nhắn chứa nội dung không phù hợp”.</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
        </li>
      </ul>
      <p class=" mt-4">
        🔗 Mọi nội dung bạn tạo đều phải tuân thủ <a href="/chinh-sach/cong-dong" class="hover:underline text-blue-500">Chính sách Cộng đồng</a> của FarmTalk.
      </p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">9. Cơ chế báo cáo và xử lý vi phạm</h2>
      <p>Bạn có thể báo cáo nội dung hoặc người dùng vi phạm thông qua nút “Báo cáo” trong ứng dụng. Chúng tôi sẽ xử lý theo các bước:</p>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Ẩn nội dung vi phạm.</li>
        <li>Cảnh cáo người dùng.</li>
        <li>Tạm khóa hoặc xóa tài khoản <strong>vĩnh viển nếu vi phạm nặng.</strong></li>
        <li>Trường hợp nghiêm trọng có thể <strong>thông báo đến cơ quan chức năng.</strong></li>
      </ul>
      <p class=" mt-4">
        🔗 Chúng tôi xử lý vi phạm dựa trên mức độ nghiêm trọng theo <a href="/chinh-sach/cong-dong" class="hover:underline text-blue-500">Chính sách Cộng đồng</a>.
      </p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">10. Lưu trữ dữ liệu & Chính sách xóa tài khoản vĩnh viễn</h2>
      <p>Ứng dụng FarmTalk cam kết bảo vệ dữ liệu người dùng trong suốt thời gian sử dụng và có cơ chế cho phép người dùng <strong>xóa tài khoản vĩnh viễn ngay trong ứng dụng</strong> khi không còn nhu cầu sử dụng.</p>

      <h3 class="mt-4 font-semibold text-green-900">10.1 Thời gian xử lý và lưu dữ liệu</h3>
      <p>Sau khi bạn xác nhận xóa, dữ liệu tài khoản của bạn sẽ được lưu tạm thời trong vòng tối đa <strong>14 ngày làm việc</strong>.</p>
      <p>Trong thời gian này, đội ngũ kiểm duyệt viên (admin / staff) sẽ kiểm tra, xử lý các nội dung liên quan (báo cáo, vi phạm nếu có) và xóa hoàn toàn khỏi hệ thống.</p>
      <p>Sau 14 ngày, toàn bộ dữ liệu sẽ bị xóa vĩnh viễn, không thể khôi phục.</p>

      <h3 class="mt-4 font-semibold text-green-900">10.2 Xóa tài khoản là gì?</h3>
      <p>Xóa tài khoản là hành động chấm dứt hoàn toàn việc sử dụng và sở hữu tài khoản cá nhân trên ứng dụng FarmTalk. Khi bạn xác nhận xóa tài khoản:</p>
      <ul class="list-disc ml-6 space-y-1">
        <li>Tài khoản sẽ bị khóa ngay lập tức, không thể đăng nhập lại ứng dụng.</li>
        <li>Sau thời gian kiểm duyệt, tất cả dữ liệu liên quan đến tài khoản sẽ bị xóa vĩnh viễn, không thể phục hồi bằng bất cứ cách nào.</li>
        <li>Việc xóa tài khoản khác hoàn toàn với việc đăng xuất. Đây là một hành động không thể hoàn tác, do đó bạn nên cân nhắc kỹ trước khi thực hiện.</li>
      </ul>

      <h3 class="mt-4 font-semibold text-green-900">10.3 Hướng dẫn xóa tài khoản vĩnh viễn</h3>
      <p>Bạn có thể tự thực hiện xóa tài khoản như sau:</p>
      <ul class="list-decimal ml-6 space-y-1">
        <li>Vào <strong>Cài đặt tài khoản</strong>.</li>
        <li>Chọn mục "<strong>Xóa tài khoản vĩnh viễn</strong>".</li>
        <li>Hệ thống sẽ yêu cầu bạn xác nhận lại hành động.</li>
        <li>Nhấn "<strong>Xác nhận xóa</strong>" để hoàn tất.</li>
      </ul>
      <p>Sau khi xác nhận, tài khoản sẽ bị khóa ngay lập tức và chuyển vào trạng thái chờ duyệt để xóa vĩnh viễn.</p>

      <h3 class="mt-4 font-semibold text-green-900">10.4 Nội dung nào sẽ bị xóa?</h3>
      <p>Khi tài khoản bị xóa:</p>
      <h4 class="font-bold text-green-700">✅ Những thứ bị xóa vĩnh viễn:</h4>
      <ul class="list-disc ml-6 space-y-1">
        <li>Bài đăng, video, hình ảnh, bình luận, lượt thích.</li>
        <li>Hồ sơ người dùng, ảnh đại diện, lịch sử hoạt động.</li>
      </ul>
      <h4 class="font-bold text-yellow-600 mt-2">⚠️ Có thể giữ lại tạm thời (nếu có báo cáo / vi phạm):</h4>
      <p class="ml-6">Các nội dung đang bị báo cáo sẽ được giữ lại để xử lý vi phạm (nếu có) trong thời hạn tối đa 14 ngày trước khi xóa hoàn toàn.</p>

      <h3 class="mt-4 font-semibold text-green-900">10.5 Lưu ý quan trọng</h3>
      
        <p>Sau khi tài khoản bị xóa vĩnh viễn, bạn sẽ không thể đăng nhập hoặc khôi phục bất kỳ dữ liệu nào đã cung cấp khi sử dụng ứng dụng FarmTalk.</p>
        <p>Hệ thống sẽ không gửi email xác nhận khi xóa hoàn tất, tuy nhiên bạn có thể liên hệ với đội ngũ hỗ trợ trong vòng 7 ngày đầu nếu cần thêm thông tin.</p>
      
    </section>
    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">11. Thay đổi chính sách</h2>
      <p>Chúng tôi có thể điều chỉnh chính sách này bất kỳ lúc nào. Thông báo sẽ được cập nhật trong ứng dụng hoặc tại trang web liên kết. Việc tiếp tục sử dụng đồng nghĩa bạn đồng ý với các thay đổi mới.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">12. Liên hệ</h2>
      <p>Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến quyền riêng tư, vui lòng liên hệ: <a href="mailto:farmtalk.help@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a></p>
    </section>
  </main>
  `;

  return (
    <div className="bg-green-50 min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
