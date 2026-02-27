# Đưa app Chấm công lên GitHub

Làm lần lượt các bước dưới đây. Nếu máy chưa cài **Git**, tải tại: https://git-scm.com/download/win (sau khi cài, mở lại terminal/VS Code).

---

## Bước 1: Tạo repository trên GitHub

1. Đăng nhập **GitHub**: https://github.com  
2. Bấm **+** (góc trên bên phải) → **New repository**  
3. Điền:
   - **Repository name**: ví dụ `ChamCong` (không dấu, không khoảng trắng)
   - **Public**
   - **Không** chọn "Add a README" (vì bạn đã có sẵn file trong thư mục)
4. Bấm **Create repository**  
5. Trang mới sẽ hiện URL dạng: `https://github.com/TEN-DANG-NHAP/ChamCong.git`  
   → **Copy** URL này (thay `TEN-DANG-NHAP` bằng tên GitHub của bạn).

---

## Bước 2: Mở terminal trong thư mục app

- Mở **Command Prompt** hoặc **PowerShell**  
- Chạy:
  ```bash
  cd /d f:\ChamCong
  ```
  (Hoặc trong VS Code / Cursor: mở thư mục `f:\ChamCong`, mở terminal tích hợp: **Terminal → New Terminal**.)

---

## Bước 3: Khởi tạo Git và đẩy code lên

Chạy từng lệnh (thay `URL_REPO_CUA_BAN` bằng URL vừa copy, ví dụ `https://github.com/abc/ChamCong.git`):

```bash
git init
git add .
git commit -m "App Chấm công - PWA, nhiều ca, xuất Excel"
git branch -M main
git remote add origin URL_REPO_CUA_BAN
git push -u origin main
```

Ví dụ nếu repo của bạn là `https://github.com/nguyenvana/ChamCong.git`:

```bash
git remote add origin https://github.com/nguyenvana/ChamCong.git
git push -u origin main
```

- Lần đầu `git push` có thể bắt đăng nhập GitHub (browser hoặc token).  
- Nếu GitHub yêu cầu **Personal Access Token** thay mật khẩu: https://github.com/settings/tokens → Generate new token (classic), chọn quyền `repo` → dùng token thay mật khẩu khi push.

---

## Bước 4: Bật GitHub Pages

1. Vào **repo** trên GitHub → tab **Settings**  
2. Bên trái chọn **Pages**  
3. Ở **Build and deployment**:
   - **Source**: chọn **GitHub Actions**  
4. Lưu (không cần tạo workflow khác, file `.github/workflows/deploy-pages.yml` đã có sẵn).

Sau vài phút, app sẽ chạy tại:

**https://TEN-DANG-NHAP.github.io/ChamCong/**

(Thay `TEN-DANG-NHAP` và `ChamCong` bằng tên GitHub và tên repo của bạn.)

---

## Dùng app trên iPhone

1. Mở **Safari**, vào đúng link GitHub Pages ở trên.  
2. **Chia sẻ** → **Thêm vào Màn hình chính** → **Thêm**.  
3. Mở từ icon trên màn hình để dùng như app.

---

## Cập nhật app sau này

Mỗi khi sửa code trong thư mục `f:\ChamCong`:

```bash
cd /d f:\ChamCong
git add .
git commit -m "Mô tả thay đổi"
git push
```

GitHub Actions sẽ tự deploy lại; vài phút sau trang GitHub Pages sẽ là bản mới.
