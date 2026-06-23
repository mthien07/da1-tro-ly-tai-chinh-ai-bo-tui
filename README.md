<p align="center">
  <img src="https://img.shields.io/badge/🐝_HTX_OneBee-AI_Finance-00d4aa?style=for-the-badge&labelColor=0a1628" alt="OneBee AI Finance"/>
</p>

<h1 align="center">📊 Trợ lý Tài chính AI bỏ túi</h1>

<p align="center">
  <strong>Pocket Finance AI — Số hóa sổ sách cho hộ kinh doanh Tây Ninh</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Hội_thi-KNĐMST_2026-f4b942?style=flat-square" alt="Contest"/>
  <img src="https://img.shields.io/badge/Giai_đoạn-Ý_tưởng-00d4aa?style=flat-square" alt="Stage"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/HTX_OneBee-MST_1102128064-grey?style=flat-square" alt="Tax ID"/>
</p>

---

## 🎯 Vấn đề

Nhiều hộ kinh doanh cá thể tại Tây Ninh (muối tôm, bánh tráng, nhang...) vẫn quản lý tài chính bằng **sổ tay** hoặc **Excel thô sơ**. Khi cần vay vốn ngân hàng, họ thiếu báo cáo tài chính minh bạch.

## 💡 Giải pháp

Biến **chiếc điện thoại** thành **"Kế toán viên AI bỏ túi"** — chỉ cần chụp ảnh hóa đơn, AI bóc tách dữ liệu và lập báo cáo tài chính tự động.

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 📸 **OCR thông minh** | Nhận diện chữ viết tay, hóa đơn in, phiếu thu chi tiếng Việt có dấu |
| 🔴 **Human-in-the-loop** | Ký tự AI không chắc (< 80%) được bôi đỏ để người dùng sửa |
| 📊 **Báo cáo 1 chạm** | Tổng hợp thu chi, lãi lỗ, dòng tiền theo ngày/tuần/tháng |
| 🏦 **Xuất hồ sơ vay vốn** | Chuẩn bị báo cáo tài chính đúng format ngân hàng |
| 🤖 **AI phân loại** | Tự động phân loại khoản thu/chi bằng Gemini AI |

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                📱 Mobile App (React Native)          │
│         Chụp ảnh → Xem kết quả → Sửa → Lưu         │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│              ⚙️ Backend (Python + FastAPI)            │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  OpenCV    │  │ Google Cloud │  │  Gemini AI   │ │
│  │ Tiền xử lý│→ │ Vision OCR   │→ │ Phân tích    │ │
│  │ (cắt,xoay)│  │ (bóc tách)   │  │ (phân loại)  │ │
│  └────────────┘  └──────────────┘  └──────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│          💾 Database + Báo cáo                       │
│   PostgreSQL │ Biểu đồ thu-chi │ Export PDF/Excel    │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Công nghệ sử dụng

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | React Native (Expo) |
| Backend | Python, FastAPI |
| OCR | Google Cloud Vision API |
| Tiền xử lý ảnh | OpenCV |
| AI/ML | Gemini API, Ollama (offline fallback) |
| OCR Offline | Tesseract (dự phòng) |
| Database | PostgreSQL |

## 🚀 Chạy Demo

```bash
# Clone repo
git clone https://github.com/mthien07/da1-tro-ly-tai-chinh-ai-bo-tui.git
cd da1-tro-ly-tai-chinh-ai-bo-tui

# Mở demo web (không cần cài đặt)
open demo/index.html
```

> 💡 Demo web là bản mô phỏng tương tác đầy đủ, chạy trực tiếp trên trình duyệt mà không cần backend.

## 📁 Cấu trúc dự án

```
da1-tro-ly-tai-chinh-ai-bo-tui/
├── demo/
│   └── index.html          # Web demo tương tác (OCR → Báo cáo)
├── docs/
│   ├── m02-m03-ho-so-du-thi.md  # Hồ sơ dự thi M-02 & M-03
│   ├── pitch-deck.md            # Pitch Deck (10 slides)
│   └── video-script.md          # Kịch bản video 3 phút
└── README.md
```

## 🎯 Mô hình kinh doanh

| Gói | Giá/tháng | Tính năng |
|-----|-----------|-----------|
| 🆓 Miễn phí | 0đ | Chụp ảnh + bóc tách (50 ảnh/tháng) |
| 📦 Cơ bản | 49.000đ | Không giới hạn + báo cáo tự động |
| ⭐ Cao cấp | 149.000đ | + Xuất file ngân hàng + Tư vấn AI |
| 🏢 Doanh nghiệp | Liên hệ | Nhiều nhân viên, chuỗi cửa hàng |

## 📌 Trạng thái dự án

- ✅ Hồ sơ dự thi M-02/M-03
- ✅ Pitch Deck
- ✅ Video Script
- ✅ Web Demo tương tác
- 🔄 Phát triển MVP (theo kế hoạch)

## 📞 Liên hệ

**Hợp tác xã OneBee**
- 📍 45 đường số 6, KDC Thái Dương, Phường Long An, Tây Ninh
- 📱 0385 944 909
- 🔢 MST: 1102128064
- 👤 Người đại diện: HUỲNH TRỌNG HIẾU

---

<p align="center">
  <em>Dự án dự thi Hội thi Khởi nghiệp Đổi mới Sáng tạo tỉnh Tây Ninh năm 2026</em><br/>
  <strong>🐝 HTX OneBee — Chuyển đổi số cho cộng đồng</strong>
</p>
