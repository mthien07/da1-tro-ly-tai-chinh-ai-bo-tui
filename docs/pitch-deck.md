# 📊 PITCH DECK — DA1: Trợ lý Tài chính AI bỏ túi
*10 Slides Presentation - Pitching tại Hội thi Khởi nghiệp đổi mới sáng tạo tỉnh Tây Ninh năm 2026*

---

## 🖥️ Slide 1: Trang bìa (Cover Page)
* **Tiêu đề:** TRỢ LÝ TÀI CHÍNH AI BỎ TÚI
* **Phụ đề:** Số hóa sổ sách tài chính tự động cho hộ kinh doanh cá thể bằng công nghệ OCR & AI
* **Đơn vị thực hiện:** Hợp tác xã OneBee (Tây Ninh)
* **Ý tưởng dự thi:** Giải pháp chuyển đổi số tài chính toàn diện, tinh gọn và bình dân hóa.
* **Hình ảnh minh họa gợi ý:** Một tiểu thương cười rạng rỡ đang cầm điện thoại chụp ảnh hóa đơn muối tôm Tây Ninh, bên cạnh là giao diện ứng dụng di động hiển thị biểu đồ dòng tiền tăng trưởng.

---

## 🖥️ Slide 2: Vấn đề thị trường (The Problem)
* **Tiêu đề Slide:** Nỗi đau sổ sách của hộ kinh doanh cá thể
* **Nội dung chính:**
  1. **Quản lý bằng tay:** Sổ tay dễ rách, mất mát dữ liệu, nhầm lẫn con số. [Unverified] Thời gian ghi chép thủ công cần đo qua khảo sát/pilot.
  2. **Mất cơ hội tiếp cận vốn:** Không có báo cáo dòng tiền, báo cáo tài chính minh bạch, dẫn đến bị ngân hàng từ chối cho vay, phải tìm đến tín dụng đen.
  3. **Rào cản công nghệ:** Phần mềm kế toán hiện nay quá phức tạp, giao diện nhiều nút, chi phí đắt đỏ đối với cô chú tiểu thương.
* **Bối cảnh Tây Ninh:** [Unverified] Nhiều hộ kinh doanh bánh tráng, muối tôm, nhang, mãng cầu đang vận hành kiểu "tiền vô túi này, ra túi kia", chưa có bức tranh tài chính rõ ràng.

---

## 🖥️ Slide 3: Giải pháp đột phá (The Solution)
* **Tiêu đề Slide:** "Kế toán viên AI" trong túi quần của bạn
* **Nội dung chính:**
  * **Giải pháp:** Một ứng dụng di động đơn giản trên smartphone.
  * **Cách thức:** Chụp ảnh hóa đơn, biên lai → AI tự động đọc và phân loại → Tự động lập báo cáo tài chính chuẩn ngân hàng.
  * **Giá trị cốt lõi:**
    * **Đơn giản tối đa:** Bật app → Chụp hình → Xong.
    * **Có người kiểm chứng:** Sử dụng cơ chế Human-in-the-loop để người dùng xác nhận dữ liệu trước khi lưu.
    * **Minh bạch hóa dòng tiền:** Hỗ trợ hồ sơ vay vốn nhanh chóng.

---

## 🖥️ Slide 4: Sản phẩm & Công nghệ (Product & Demo)
* **Tiêu đề Slide:** Quy trình 3 bước "Không chạm" (Zero-touch)
* **Nội dung chính:**
  1. **Chụp & Xử lý ảnh (OpenCV):** Cắt xén, khử nhiễu, tăng độ tương phản của hóa đơn bị nhòe/mờ.
  2. **Bóc tách thông tin (Google Cloud Vision OCR + AI):** Hỗ trợ đọc hóa đơn/phiếu thu chi tiếng Việt. Tự động **bôi đỏ** chữ AI chưa chắc chắn để người dùng chạm nhẹ sửa lại; độ chính xác cần đo bằng dữ liệu pilot.
  3. **Tự động hóa báo cáo:** n8n workflow tự động cập nhật sổ cái và vẽ biểu đồ doanh thu, chi phí, lãi lỗ thời gian thực.
* **Hình ảnh minh họa gợi ý:** Sơ đồ kiến trúc [OCR → Process → Report] và screenshot giao diện Web Demo đã xây dựng.

---

## 🖥️ Slide 5: Tiềm năng thị trường (TAM/SAM/SOM)
* **Tiêu đề Slide:** Thị trường tiềm năng khổng lồ
* **Số liệu phân tích:**
  * **TAM (Thị trường tổng):** [Inference] Cả nước có khoảng 5,2 triệu hộ kinh doanh cá thể; cần dẫn nguồn Tổng cục Thống kê theo năm cụ thể.
  * **SAM (Thị trường khả dụng):** [Unverified] Khoảng 200.000 hộ kinh doanh tại Tây Ninh và khu vực Đông Nam Bộ có sử dụng smartphone và có nhu cầu vay vốn phát triển sản xuất.
  * **SOM (Thị trường khả đạt năm 1):** [Unverified] Mục tiêu 2.000 hộ kinh doanh tại Tây Ninh thông qua các hội đoàn địa phương.
* **Ghi chú kiểm chứng:** Các con số thị trường là **[Unverified] giả định kinh doanh**, sẽ được cập nhật chính xác sau đợt khảo sát diện rộng kết hợp với Sở KH&CN Tây Ninh.

---

## 🖥️ Slide 6: Mô hình kinh doanh (Business Model)
* **Tiêu đề Slide:** Mô hình Freemium - Linh hoạt & Tiếp cận nhanh
* **Nội dung chính:**
  * **Gói Miễn phí (Free):** Chụp ảnh + bóc tách tối đa 50 hóa đơn/tháng. Đủ cho hộ kinh doanh rất nhỏ.
  * **Gói Cơ bản (Pro - 49.000đ/tháng):** Không giới hạn số lượng hóa đơn, tự động lập báo cáo tài chính hàng tháng.
  * **Gói Cao cấp (Premium - 149.000đ/tháng):** Xuất báo cáo tài chính chuẩn định dạng xét duyệt vay vốn ngân hàng + Trợ lý ảo AI tư vấn tài chính riêng.
  * **Gói Hợp tác xã/Doanh nghiệp:** Phí tùy chỉnh cho chuỗi bán lẻ.

---

## 🖥️ Slide 7: Phân tích cạnh tranh (Competition)
* **Tiêu đề Slide:** Đơn giản hóa là Lợi thế cạnh tranh tuyệt đối
* **Bảng so sánh:**

| Tiêu chí | Phần mềm truyền thống (Misa, Fast) | Sổ tay / Excel | Trợ lý Tài chính AI OneBee |
|---|---|---|---|
| **Độ khó sử dụng** | Cao hơn với người không có nghiệp vụ kế toán | Thấp (nhưng tốn công) | **Đơn giản hóa quanh thao tác chụp ảnh** |
| **Bóc tách hóa đơn** | Không có / Giới hạn | Không có | **Có hướng OCR + người dùng xác nhận** |
| **Giá thành** | Có thể cao với hộ rất nhỏ | Miễn phí | **Chi phí thấp** (từ 49.000đ/tháng theo khung đề xuất) |
| **Hỗ trợ vay vốn** | Phải tự xuất báo cáo phức tạp | Không được ngân hàng chấp nhận | **Xuất file chuẩn ngân hàng 1 chạm** |

---

## 🖥️ Slide 8: Chiến lược Go-To-Market (GTM)
* **Tiêu đề Slide:** Chiến lược tiếp cận từ cơ sở
* **Nội dung chính:**
  * **Kênh liên kết chính quyền:** Hợp tác với **Hội Liên hiệp Phụ nữ**, **Hội Nông dân** tỉnh Tây Ninh tổ chức tập huấn chuyển đổi số nông thôn, hướng dẫn tiểu thương cài đặt app trực tiếp tại các chợ truyền thống.
  * **Chiến dịch "Chợ số 4.0":** Triển khai thí điểm tại Chợ Tây Ninh, Chợ Long Hoa. Mỗi tiểu thương tham gia được tặng 3 tháng trải nghiệm miễn phí gói Pro.
  * **Truyền thông địa phương:** Tin bài trên báo Tây Ninh, Đài Phát thanh - Truyền hình Tây Ninh để tạo dựng niềm tin thương hiệu.

---

## 🖥️ Slide 9: Lộ trình phát triển (Roadmap)
* **Tiêu đề Slide:** Lộ trình 2 năm phủ sóng Đông Nam Bộ
* **Nội dung chính:**
  * **Tháng 07/2026:** Hoàn thiện bản MVP thử nghiệm nội bộ với 20 hộ kinh doanh tại HTX OneBee.
  * **Tháng 09/2026:** Ra mắt phiên bản chính thức trên iOS/Android. Bắt đầu chiến dịch "Chợ số 4.0" tại Tây Ninh. Mục tiêu đạt 1.000 người dùng.
  * **Tháng 03/2027:** Tích hợp tính năng nộp hồ sơ vay vốn liên kết với 01 Ngân hàng đối tác. Đạt 5.000 người dùng.
  * **Năm 2028:** Mở rộng thị trường ra Bình Dương, Bình Phước, Long An. [Unverified] Đạt mục tiêu 20.000 người dùng, doanh thu 500 triệu đồng/năm.

---

## 🖥️ Slide 10: Đội ngũ & Tác động xã hội
* **Tiêu đề Slide:** Đội ngũ OneBee & Khát vọng nâng tầm nông thôn Tây Ninh
* **Nội dung chính:**
  * **Đội ngũ sáng lập:** OneBee Team — nhóm công nghệ tập trung vào ứng dụng di động, tích hợp AI và chuyển giao công cụ số cho người dùng phổ thông.
  * **Tác động xã hội:**
    * [Unverified] Hướng đến giúp hàng ngàn tiểu thương nông thôn làm chủ tài chính cá nhân.
    * Góp phần thúc đẩy tài chính toàn diện (Financial Inclusion) tại địa phương.
    * [Inference] Góp phần vào mục tiêu chuyển đổi số của tỉnh Tây Ninh năm 2026.
* **Thông điệp kết thúc:** *"OneBee - Đồng hành cùng kinh tế nông thôn bước vào kỷ nguyên số!"*
