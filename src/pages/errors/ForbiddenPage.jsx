import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#173846] text-white p-4">
      <ShieldAlert className="w-24 h-24 text-[#e96a52] mb-6" />
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2 text-center">Không có quyền truy cập</h2>
      <p className="text-white/70 text-center max-w-md mb-8">
        Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản hợp lệ.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-6 py-3 bg-[#e96a52] hover:bg-[#d75c46] text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Đăng nhập
        </Link>
        <Link 
          to="/" 
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
