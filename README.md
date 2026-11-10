# Bản đồ văn hoá số Vĩnh Gia 2

Trường TH&THCS Vĩnh Gia 2 · Bốn điểm trường – Một mái nhà chung – Ngàn câu chuyện văn hoá.

Trang web tĩnh (HTML, CSS, JavaScript thuần), dữ liệu nằm trong các tệp JSON ở thư mục `data/`. Không cần máy chủ hay cơ sở dữ liệu, đăng miễn phí được trên GitHub Pages.

## Cấu trúc

```
index.html            Khung trang
assets/css/style.css  Giao diện (màu theo logo, hỗ trợ chế độ tối)
assets/js/app.js      Bản đồ, menu sổ xuống, hành trình, thư viện sản phẩm
assets/img/           Logo trường, logo Đoàn, ảnh trụ sở và sản phẩm
data/                 config, sites, classes, products, content (.json)
scripts/quan_ly.py    Thêm lớp, thêm sản phẩm, kiểm tra dữ liệu
```

## Chạy thử trên máy

M�� thư mục trong terminal rồi chạy `python3 -m http.server 8000`, sau đó vào http://localhost:8000. Không mở trực tiếp `index.html` bằng nháy đúp vì trình duyệt chặn đọc tệp JSON.

## Đưa lên GitHub Pages

1. Tạo kho mới trên GitHub (ví dụ `ban-do-van-hoa-so-vinh-gia-2`), tải toàn bộ thư mục này lên nhánh `main`.
2. Vào **Settings → Pages**, phần *Build and deployment* chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, bấm Save.
3. Sau ít phút trang chạy tại `https://<tên-tài-khoản>.github.io/<tên-kho>/`.

M��i lần sửa tệp trong `data/` rồi commit, trang tự cập nhật.

## Cập nhật dữ liệu

- **Nội dung "Vùng đất"**: sửa `data/content.json` (các khoá `intro`, `mission`, `photos`, `stories`, `milestones`).
- **Trụ sở**: sửa `data/sites.json`, khoá `tc`, `vt`, `ph`, `np`. Điền `lat`, `lng` (ví dụ `"10.5"`) để bản đồ định vị theo toạ độ thật và hiện nút Google Maps; `photo` là đường dẫn ảnh như `assets/img/tru-so-chinh.jpg`.
- **Lớp**: `python3 scripts/quan_ly.py lop --ten 3A --gv "Họ tên GVCN" --tru tc --khau-hieu "..."`
- **Sản phẩm đã duyệt**: `python3 scripts/quan_ly.py san-pham --lop l3a --thu-thach c2 --chu-de dp --tieu-de "..." --mo-ta "..." --diem 42 --anh assets/img/san-pham/a.jpg`
  - Chủ đề: `hs, ts, un, dp, ds, xanh, so`. Thử thách: `c1` đến `c6`. Điểm 0–50 (5 tiêu chí × 10 điểm). Ngày dạng `YYYY-MM-DD`, sản phẩm tự xếp theo năm học.
- **Kiểm tra trước khi đăng**: `python3 scripts/quan_ly.py kiem-tra`
- **Nhận sản phẩm từ lớp**: tạo biểu mẫu (Google Form hoặc tương tự), dán đường dẫn vào `data/config.json`, khoá `formUrl`. Ban quản trị duyệt rồi mới thêm vào `products.json`.

## Lưu ý bản quyền và an toàn

- Chỉ đăng ảnh, video, bài viết do nhà trường tạo ra hoặc được phép sử dụng; ghi rõ nguồn tư liệu.
- Không đăng thông tin cá nhân của học sinh (số điện thoại, địa chỉ riêng); cần sự đồng ý của phụ huynh khi đăng hình ảnh học sinh.
- Logo trường và logo Đoàn thuộc quyền sử dụng của đơn vị sở hữu; đây là sơ đồ minh hoạ, không theo tỉ lệ địa lý.
