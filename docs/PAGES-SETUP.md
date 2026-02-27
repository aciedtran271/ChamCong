# Cách bật GitHub Pages cho repo ChamCong

## Cách 1: Deploy từ nhánh main (đơn giản, không cần workflow)

1. Vào **Settings** → **Pages** (repo ChamCong).
2. **Source:** chọn **Deploy from a branch**.
3. **Branch:** chọn **main**.
4. **Folder:** chọn **/ (root)**.
5. Bấm **Save**.

→ Site chạy ngay tại **https://aciedtran271.github.io/ChamCong/** (không cần Actions).

---

## Cách 2: Deploy từ nhánh gh-pages (qua workflow)

1. **Settings** → **Pages** → **Deploy from a branch**.
2. **Branch:** chọn **gh-pages**, **Folder:** **/ (root)** → **Save**.
3. Vào **Actions** → workflow "Deploy to GitHub Pages" → **Run workflow** (nhánh main).
4. Đợi chạy xong (màu xanh), rồi tải lại trang site.

Nếu workflow báo lỗi 403/permission: dùng **Cách 1** (branch **main**) là đủ.
