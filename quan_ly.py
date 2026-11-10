#!/usr/bin/env python3
"""Công cụ quản lý dữ liệu Bản đồ văn hoá số Vĩnh Gia 2.
Cách dùng (chạy ở thư mục gốc dự án):
  python scripts/quan_ly.py lop --ten 3A --gv "Cô Lan" --tru tc --khau-hieu "Đoàn kết, sáng tạo"
  python scripts/quan_ly.py san-pham --lop 3a --thu-thach c2 --chu-de dp --tieu-de "Làng nghề quê em" --mo-ta "..." --diem 42 --anh assets/img/san-pham/a.jpg
  python scripts/quan_ly.py kiem-tra
"""
import argparse, json, re, sys, time
from datetime import date
from pathlib import Path
D = Path(__file__).resolve().parent.parent / "data"
TRU = ["tc", "vt", "ph", "np"]
CHUDE = ["hs", "ts", "un", "dp", "ds", "xanh", "so"]
THUTHACH = ["c1", "c2", "c3", "c4", "c5", "c6"]

def doc(n): return json.loads((D / f"{n}.json").read_text(encoding="utf-8"))
def ghi(n, o): (D / f"{n}.json").write_text(json.dumps(o, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def kiem_tra():
    loi = []
    try:
        lop, sp = doc("classes"), doc("products")
        for n in ("config", "sites", "content"): doc(n)
    except Exception as e:
        sys.exit(f"Lỗi đọc JSON: {e}")
    ids = {c["id"] for c in lop}
    for c in lop:
        if c.get("site") not in TRU: loi.append(f"Lớp {c.get('id')}: trụ sở '{c.get('site')}' không hợp lệ")
    for p in sp:
        t = p.get("title", "?")
        if p.get("cls") not in ids: loi.append(f"Sản phẩm '{t}': lớp '{p.get('cls')}' chưa có trong classes.json")
        if p.get("ch") not in THUTHACH: loi.append(f"Sản phẩm '{t}': thử thách phải là {THUTHACH}")
        if p.get("topic") not in CHUDE: loi.append(f"Sản phẩm '{t}': chủ đề phải là {CHUDE}")
        if not 0 <= p.get("total", 0) <= 50: loi.append(f"Sản phẩm '{t}': điểm phải từ 0 đến 50")
        if not re.match(r"\d{4}-\d{2}-\d{2}$", p.get("date", "")): loi.append(f"Sản phẩm '{t}': date dạng YYYY-MM-DD")
    print("\n".join(loi) if loi else "Dữ liệu hợp lệ.")
    sys.exit(1 if loi else 0)

a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
s = a.add_subparsers(dest="lenh", required=True)
l = s.add_parser("lop"); l.add_argument("--ten", required=True); l.add_argument("--gv", default=""); l.add_argument("--tru", required=True, choices=TRU); l.add_argument("--khau-hieu", default="")
p = s.add_parser("san-pham")
for k in ("lop", "tieu-de"): p.add_argument("--" + k, required=True)
p.add_argument("--thu-thach", required=True, choices=THUTHACH); p.add_argument("--chu-de", required=True, choices=CHUDE)
for k in ("mo-ta", "link", "anh", "video"): p.add_argument("--" + k, default="")
p.add_argument("--diem", type=int, default=0); p.add_argument("--ngay", default=str(date.today()))
s.add_parser("kiem-tra")
x = a.parse_args()
if x.lenh == "kiem-tra": kiem_tra()
elif x.lenh == "lop":
    ds = doc("classes"); i = "l" + re.sub(r"\W", "", x.ten.lower())
    if any(c["id"] == i for c in ds): sys.exit(f"Lớp {x.ten} đã có.")
    ds.append({"id": i, "name": x.ten, "teacher": x.gv, "site": x.tru, "slogan": x.khau_hieu}); ghi("classes", ds); print("Đã thêm lớp", x.ten, "với mã", i)
else:
    ds = doc("products")
    ds.append({"id": "p" + str(int(time.time())), "title": x.tieu_de, "desc": x.mo_ta, "cls": x.lop, "ch": x.thu_thach, "topic": x.chu_de, "link": x.link, "image": x.anh, "video": x.video, "date": x.ngay, "total": x.diem})
    ghi("products", ds); print("Đã thêm sản phẩm:", x.tieu_de)
