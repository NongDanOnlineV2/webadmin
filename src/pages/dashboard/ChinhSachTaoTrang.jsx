export default function ChinhSachTaoTrang() {
  const html = `
    <header class="bg-green-700 text-white py-6 px-4 shadow">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-4xl mb-2">🌾</div>
        <h1 class="text-3xl font-bold">CHÍNH SÁCH TẠO TRANG TRẠI</h1>
        <p class="mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
      </div>
    </header>
    <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
        <p><strong>Chính sách này áp dụng cho ứng dụng Farm Talk</strong> (sau đây gọi là “Ứng dụng”), được phát triển bởi <strong>Amazing Tech</strong> (sau đây gọi là “Nhà cung cấp dịch vụ”), như một dịch vụ miễn phí. Ứng dụng được phát hành trên cả hai nền tảng <strong>Android và iOS</strong>, thông qua <strong>Google Play Store </strong>và <strong>Apple App Store.</strong> Chính sách này quy định về <strong>quy trình, điều kiện và trách nhiệm </strong>của người dùng khi đăng ký và tạo mới một Trang trại trên Ứng dụng. Việc tạo trang trại được xem là đồng ý và cam kết tuân thủ theo các điều khoản nêu tại văn bản này.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">1. Mục đích</h2>
        <p>Chính sách này nhằm đảm bảo mọi trang trại được tạo trên nền tảng <strong>FarmTalk</strong> đều là thật, minh bạch, 
        và đủ năng lực vận hành, phù hợp với tầm nhìn xây dựng một hệ sinh thái <strong>nông nghiệp bền vững – kết nối – minh bạch.</strong></p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">2. Đối tượng áp dụng</h2>
        <p>Người dùng có vai trò <strong>Nông dân (Farmer) </strong>và đã đăng nhập trên hệ thống.</p>
        <p>Có mong muốn đăng ký Trang trại mới để tham gia cộng đồng nông nghiệp, chia sẻ thông tin, hình ảnh và kết nối thương mại.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">3. Quy trình tạo Trang trại</h2>
        <table class="w-full text-left border border-green-200">
          <thead class="bg-green-100 text-green-900">
          </thead>
          <tbody>
            <p class=" font-medium">Bước 1: Nhập thông tin cơ bản (Bắt buộc).</p>
            <p class=" font-medium">Bước 2: Trả lời bộ câu hỏi đánh giá chuẩn hóa (Bắt buộc).</p>
          </tbody>
        </table>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">4. Thông tin cần cung cấp</h2>
        <table class="w-full text-left border-2 border-green-700">
          <thead class="bg-green-100 text-green-900 border-b-2 border-green-700">
            <tr>
            <th class="p-2 border-2 border-green-700">Thông tin</th>
            <th class="p-2 border-2 border-green-700">Bắt buộc</th>   
            <th class="p-2 border-2 border-green-700">Mục đích</th>
            <th class="p-2 border-2 border-green-700">Ghi chứ</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Tên trang trại</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Định danh và hiển thị công khai</td>
                <td class="p-2 border-2 border-green-700">Ví dụ: "Trang trại Rau Sạch Đà Lạt"</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Địa chỉ cụ thể (Tỉnh/Huyện/Xã) </td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Xác thực vị trí thực tế</td>
                <td class="p-2 border-2 border-green-700">Yêu cầu ghi rõ, tránh nhập chung chung</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Diện tích</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Phân loại quy mô farm</td>
                <td class="p-2 border-2 border-green-700">Đơn vị: m²</td>
            </tr>
                <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Diện tích đang canh tác</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Đánh giá mức độ hoạt động thực tế</td>
                <td class="p-2 border-2 border-green-700">Ước lượng diện tích đang sản xuất trực tiếp</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Dịch vụ cung cấp</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Đánh giá khả năng hỗ trợ logistics</td>
                <td class="p-2 border-2 border-green-700">Vận chuyển, đóng gói, lưu kho...</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Mô hình canh tác</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Phân loại kỹ thuật</td>
                <td class="p-2 border-2 border-green-700">Thủy canh, nhà lưới, hữu cơ, truyền thống</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Chứng nhận</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Tạo uy tín & phân loại</td>
                <td class="p-2 border-2 border-green-700">VietGAP, GlobalGAP, Hữu cơ...</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Tags mô tả</td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Gợi ý từ khóa giúp tìm kiếm và phân loại farm</td>
                <td class="p-2 border-2 border-green-700">Ví dụ: RauSach, HuuCo, DaLat,...</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Hình ảnh trang trại </td>
                <td class="p-2 border-2 border-green-700">Có</td>
                <td class="p-2 border-2 border-green-700">Kiểm tra trang trại có thật</td>
                <td class="p-2 border-2 border-green-700">Tối đa 5 ảnh thực tế</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">SĐT</td>
                <td class="p-2 border-2 border-green-700">Không</td>
                <td class="p-2 border-2 border-green-700">Kết nối và xác minh (khuyến nghị có)</td>
                <td class="p-2 border-2 border-green-700">Gợi ý nhập để tăng độ tin cậy</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Zalo</td>
                <td class="p-2 border-2 border-green-700">Không</td>
                <td class="p-2 border-2 border-green-700">Kết nối và xác minh (khuyến nghị có)</td>
                <td class="p-2 border-2 border-green-700">Có thể dùng cho xác minh sau</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2 italic text-sm text-gray-700">* Trang trại có đầy đủ ảnh và địa chỉ cụ thể sẽ được ưu tiên phê duyệt nhanh hơn.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">5. Bộ câu hỏi đánh giá chuẩn hóa</h2>
        <table class="w-full text-left border-2 border-green-700">
          <thead class="bg-green-100 text-green-900 border-b-2 border-green-700">
            <tr>
            <th class="p-2 border-2 border-green-700">Chủ đề</th>
            <th class="p-2 border-2 border-green-700">Nội dung</th>
            <th class="p-2 border-2 border-green-700">Mục tiêu</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Trồng trọt & An toàn thực phẩm</td>
                <td class="p-2 border-2 border-green-700">Mô hình, nhật ký, chứng nhận</td>
                <td class="p-2 border-2 border-green-700">Đảm bảo quy trình sản xuất an toàn</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Năng lực giao hàng</td>
                <td class="p-2 border-2 border-green-700">Đóng gói, vận chuyển, tần suất xuất hàng</td>
                <td class="p-2 border-2 border-green-700">Đánh giá khả năng thương mại hóa</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Sẵn sàng kỹ thuật số</td>
                <td class="p-2 border-2 border-green-700">Sử dụng smartphone, livestream, nhận đơn</td>
                <td class="p-2 border-2 border-green-700">Chuẩn bị cho thương mại điện tử</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Cam kết hợp tác</td>
                <td class="p-2 border-2 border-green-700">Thương hiệu, minh bạch, mục tiêu tham gia</td>
                <td class="p-2 border-2 border-green-700">Xác định mức độ sẵn sàng cộng tác</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2">Tất cả câu hỏi đều bắt buộc trả lời, nếu thiếu sẽ không thể gửi đơn đăng ký.</p>
        <p class="mt-2">Hệ thống hỗ trợ các loại câu hỏi: Chọn một, chọn nhiều, nhập câu trả lời khác.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">6. Xác nhận và phê duyệt</h2>
        <table class="w-full text-left border border-green-200">
          <thead class="bg-green-100 text-green-900">
            <tr><th class="p-2 border-2 border-green-700">Giai đoạn</th><th class="p-2 border-2 border-green-700">Mô tả</th></tr>
          </thead>
          <tbody>
            <tr class="border-2 border-green-700">
            <td class="p-2 border-2 border-green-700">Gửi đăng ký</td>
            <td class="p-2 border-2 border-green-700">Khi hoàn tất cả thông tin và câu hỏi, người dùng bấm “Gửi Đăng ký”</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Trạng thái hồ sơ</td>
                <td class="p-2 border-2 border-green-700">Hệ thống tạo trang trại với trạng thái "Chờ phê duyệt"</td></tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Thông báo Quản trị viên</td>
                <td class="p-2 border-2 border-green-700">Admin nhận thông báo và xem hồ sơ chi tiết</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Phê duyệt</td>
                <td class="p-2 border-2 border-green-700">Nếu đạt yêu cầu, Admin duyệt và chuyển farm sang trạng thái Hoạt động</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Từ chối</td>
                <td class="p-2 border-2 border-green-700">Nếu thiếu minh bạch hoặc không đáp ứng tiêu chí, farm bị từ chối</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">7. Trường hợp đặc biệt</h2>
        <table class="w-full text-left border-2 border-green-700">
          <thead class="bg-green-100 text-green-900 border-b-2 border-green-700">
            <tr><th class="p-2 border-2 border-green-700">Trường hợp</th><th class="p-2 border-2 border-green-700">Hệ thống xử lý</th></tr>
          </thead>
          <tbody>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Thiếu thông tin bắt buộc</td>
                <td class="p-2 border-2 border-green-700">Cảnh báo: “Vui lòng điền đầy đủ thông tin và trả lời tất cả các câu hỏi.”</td>
            </tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Mất kết nối mạng</td>
                <td class="p-2 border-2 border-green-700">Hiển thị lỗi, cho phép thử lại</td></tr>
            <tr class="border-2 border-green-700">
                <td class="p-2 border-2 border-green-700">Tạo farm giả, dùng ảnh mạng, spam</td>
                <td class="p-2 border-2 border-green-700">Farm sẽ bị từ chối và khóa vĩnh viễn nếu phát hiện vi phạm chính sách</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">8. Cam kết của người dùng</h2>
        <p>“Tôi cam kết rằng các thông tin cung cấp là đúng sự thật. Nếu phát hiện thông tin sai lệch, hệ thống có quyền từ chối hoặc xóa hồ sơ trang trại.”</p>
        <p>“Ngoài thông tin chính xác, người dùng <strong>cam kết tuân thủ</strong><a href="/chinh-sach/cong-dong" class="hover:underline text-blue-500"> Chính sách Cộng đồng </a> trong suốt quá trình hoạt động trên nền tảng.”</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">9. Thay đổi điều khoản</h2>
        <p>Điều khoản có thể được cập nhật bất kỳ lúc nào. Việc tiếp tục sử dụng ứng dụng được hiểu là đã chấp nhận các điều khoản mới.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-green-900 mb-2">10. Liên hệ</h2>
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
