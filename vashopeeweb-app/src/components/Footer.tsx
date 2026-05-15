import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            VA<span className="text-pink-400">Beauty</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Cửa hàng mỹ phẩm chính hãng với đa dạng sản phẩm từ các thương hiệu nổi tiếng trong và ngoài nước.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Danh Mục</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=son-moi" className="hover:text-pink-400 transition-colors">Son Môi</Link></li>
            <li><Link to="/products?category=kem-duong" className="hover:text-pink-400 transition-colors">Kem Dưỡng</Link></li>
            <li><Link to="/products?category=serum" className="hover:text-pink-400 transition-colors">Serum</Link></li>
            <li><Link to="/products?category=phan-trang-diem" className="hover:text-pink-400 transition-colors">Phấn Trang Điểm</Link></li>
            <li><Link to="/products?category=nuoc-hoa" className="hover:text-pink-400 transition-colors">Nước Hoa</Link></li>
            <li><Link to="/products?category=cham-soc-da" className="hover:text-pink-400 transition-colors">Chăm Sóc Da</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Liên Hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 123 Đường Nguyễn Huệ, Q.1, TP.HCM</li>
            <li>📞 0909 123 456</li>
            <li>✉️ vabeauty@gmail.com</li>
            <li>🕐 8:00 - 22:00 (Thứ 2 - Chủ Nhật)</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © 2024 VABeauty. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}
