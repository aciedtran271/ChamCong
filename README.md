# Ứng dụng Chấm công

Ghi nhận các ngày có làm việc theo lịch hàng tháng (nhiều ca/ngày) và xuất file Excel.

## Chạy trên iPhone (PWA)

1. **Đưa app lên web** (bắt buộc để dùng trên iPhone): host toàn bộ thư mục lên HTTPS, ví dụ:
   - GitHub Pages, Netlify, Vercel (kéo thả thư mục hoặc push repo)
   - Hoặc máy chủ riêng có HTTPS
2. Trên **iPhone**, mở **Safari**, vào đúng địa chỉ URL của app.
3. Bấm nút **Chia sẻ** (hộp với mũi tên đi lên) → chọn **“Thêm vào Màn hình chính”**.
4. Đặt tên (ví dụ: Chấm công) → **Thêm**. Icon app sẽ xuất hiện trên màn hình chính.
5. Mở app từ icon → chạy full màn hình như app, có thể dùng offline sau lần mở đầu.

**Lưu ý:** Nếu mở trực tiếp file `index.html` từ máy tính (file://) thì trên iPhone không cài PWA được; cần truy cập qua URL HTTPS.

## Cách sử dụng

1. Mở app (trình duyệt hoặc từ màn hình chính iPhone).
2. Chọn tháng bằng nút **←** / **→**.
3. **Chạm vào ô ngày** → chọn ca (Sáng / Chiều / Tối) → **Xong**.
4. **Xuất file Excel** để tải bảng chấm công tháng hiện tại.

## Lưu trữ

- Dữ liệu lưu trên trình duyệt (localStorage).
- Nên xuất Excel định kỳ để lưu trữ lâu dài.

## Cấu trúc thư mục

- `index.html` – Trang chính
- `styles.css` – Giao diện
- `app.js` – Logic lịch, chấm công, xuất Excel
- `manifest.json` – Cấu hình PWA (tên app, icon, chế độ standalone)
- `icon.svg` – Icon app
- `sw.js` – Service worker (cache, chạy offline)

Trên máy tính: mở `index.html` bằng trình duyệt (cần mạng lần đầu để tải thư viện xuất Excel).
