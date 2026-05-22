# Hướng Dẫn Cài Đặt – Gà Quê Diên Khánh

Làm theo thứ tự. Tổng thời gian khoảng **15–20 phút**.

---

## Bước 1 — Upload source code lên Replit

1. Đăng nhập tài khoản Replit tại [replit.com](https://replit.com)
2. Nhấn **Create Repl** → chọn **Upload folder**
3. Upload toàn bộ thư mục source code này
4. Replit tự nhận dạng là Node.js/pnpm project

---

## Bước 2 — Publish app

1. Nhấn nút **Run** — chờ 1–2 phút
2. Kiểm tra website hiển thị đúng trong Preview
3. Nhấn nút **Publish** (góc trên phải)
4. Sau khi publish xong, Replit cấp URL dạng: `tenproject.replit.app`
5. **Ghi lại URL này** — cần dùng ở bước 4

---

## Bước 3 — Mật khẩu trang Admin *(tuỳ chọn)*

Trang `/admin` mặc định dùng mật khẩu:

```
GaQue@Admin2025
```

**Nếu muốn đổi mật khẩu:**
1. Vào thanh bên trái → icon 🔒 **Secrets** → **+ New Secret**
2. Key: `ADMIN_PASSWORD`
3. Value: *(mật khẩu bạn muốn)*
4. Nhấn **Add Secret** → Restart app

**Nếu không đổi:** Bỏ qua bước này, dùng mật khẩu mặc định ở trên là được.

---

## Bước 4 — Cập nhật DNS trên Cloudflare

Vào [dash.cloudflare.com](https://dash.cloudflare.com) → chọn domain `gaquedienkhanh.com` → **DNS → Records**

### 4a. Xóa record cũ
- Xóa record **A** cũ (IP cũ không còn dùng)
- Xóa record **TXT** có nội dung `replit-verify=...` (sẽ có mã mới)

### 4b. Thêm 2 record mới

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| `CNAME` | `@` | `tenproject.replit.app` *(URL từ bước 2)* | **Mây xám** (DNS only) |
| `CNAME` | `www` | `gaquedienkhanh.com` | **Mây xám** (DNS only) |

> ⚠️ Bắt buộc để **mây xám** — nếu bật mây cam sẽ bị lỗi SSL.

---

## Bước 5 — Gắn domain vào Replit

1. Vào Replit → **Publish** → tab **Custom domain**
2. Nhập `gaquedienkhanh.com` → nhấn **Add**
3. Replit hiện mã TXT mới → vào Cloudflare thêm:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| `TXT` | `@` | `replit-verify=...` *(mã Replit cấp)* | DNS only |

4. Quay lại Replit → nhấn **Verify** → chờ ✅ xanh

---

## Bước 6 — Kiểm tra

- [ ] `https://gaquedienkhanh.com` → vào được trang chủ
- [ ] `https://www.gaquedienkhanh.com` → tự redirect về không-www
- [ ] `https://tenproject.replit.app` → tự redirect về `gaquedienkhanh.com`
- [ ] `/admin` → đăng nhập bằng `GaQue@Admin2025` (hoặc mật khẩu mới nếu đã đổi)
- [ ] Nút Messenger → dẫn đến chat Facebook

---

## Thông tin nhà hàng

| Mục | Giá trị |
|-----|---------|
| Địa chỉ | 27 Tô Hiến Thành, Nha Trang, Khánh Hòa |
| Điện thoại | 0823 890 789 |
| Facebook | https://www.facebook.com/gaquedienkhanh/ |
| Instagram | https://www.instagram.com/gaquedienkhanh/ |
| Messenger | https://m.me/gaquedienkhanh |
| Mật khẩu admin mặc định | `GaQue@Admin2025` |

---

## Hỗ trợ Replit

[replit.com/support](https://replit.com/support)
