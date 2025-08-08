export default function ChinhSachTreEm() {
  const html = `
  <!-- Header -->
  <header class="bg-green-700 text-white py-4 px-3 sm:py-6 sm:px-4 shadow">
    <div class="max-w-3xl mx-auto text-center">
      <div class="text-3xl sm:text-4xl mb-2">🌾</div>
      <h1 class="text-2xl sm:text-3xl font-bold">CHÍNH SÁCH BẢO VỆ TRẺ EM (CSAE)</h1>
      <p class="text-sm sm:text-base mt-1">Áp dụng cho ứng dụng <strong>Farm Talk</strong></p>
    </div>
  </header>

  <!-- Main content -->
  <main class="max-w-3xl mx-auto px-4 py-6 space-y-8 text-base leading-relaxed text-justify">
    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">Giới thiệu</h2>
      <p>Ứng dụng <strong>Farm Talk</strong> cam kết nghiêm cấm mọi nội dung liên quan đến bóc lột hoặc xâm hại tình dục trẻ em (CSAE). Chúng tôi áp dụng các chính sách và quy trình rõ ràng nhằm đảm bảo an toàn cho người dùng, đặc biệt là trẻ vị thành niên.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">1. Cấm nội dung CSAE</h2>
      <p>Chúng tôi nghiêm cấm đăng tải, chia sẻ hoặc quảng bá bất kỳ nội dung nào liên quan đến bóc lột tình dục trẻ em. Vi phạm sẽ dẫn đến chặn tài khoản vĩnh viễn và báo cáo cho cơ quan chức năng.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">2. Phạm vi độ tuổi</h2>
      <p>Người dùng dưới 13 tuổi cần có sự đồng ý từ cha mẹ hoặc người giám hộ để sử dụng nền tảng. Farm Talk không cho phép bất kỳ người dùng dưới 13 tuổi đăng ký tài khoản.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">3. Cơ chế kiểm duyệt</h2>
      <p>Chúng tôi có đội ngũ kiểm duyệt kết hợp với thuật toán để rà soát nội dung người dùng đăng tải. Nội dung có dấu hiệu vi phạm sẽ được đánh giá thủ công và gỡ bỏ ngay lập tức nếu xác minh là vi phạm CSAE.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">4. Báo cáo vi phạm</h2>
      <p>Farm Talk không chủ động thu thập dữ liệu cá nhân của trẻ em. Nếu phát hiện bất kỳ trường hợp nào như vậy, hệ thống sẽ xóa dữ liệu liên quan và khóa tài khoản theo quy trình nội bộ.</p>    
      <p>Người dùng có thể báo cáo nội dung không phù hợp bằng tính năng <strong>báo cáo trong ứng dụng</strong> hoặc liên hệ trực tiếp qua email.</p>    
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">5. Hợp tác với cơ quan chức năng</h2>
      <p>Farm Talk cam kết hợp tác đầy đủ với các cơ quan chức năng và sẽ cung cấp mọi thông tin, dữ liệu cần thiết khi nhận được yêu cầu hợp pháp liên quan đến hành vi khai thác, lạm dụng hoặc xâm hại trẻ em.</p>
    </section>

    <section>
      <h2 class="text-lg sm:text-xl font-semibold text-green-900 mb-2">6. Liên hệ</h2>
      <p>Nếu bạn phát hiện nội dung hoặc hành vi vi phạm, vui lòng liên hệ qua email: </p>
      <p>Email: <a href="mailto:truonglongkt2021@gmail.com" class="text-blue-600 underline">farmtalk.help@gmail.com</a></p>
    </section>
  </main>
  `;

  return (
    <div className="bg-green-50 min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
