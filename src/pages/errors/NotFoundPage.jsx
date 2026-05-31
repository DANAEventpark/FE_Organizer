import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#173846] text-white p-4">
      <AlertCircle className="w-24 h-24 text-[#e96a52] mb-6 animate-pulse" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-center">Trang không tồn tại</h2>
      <p className="text-white/70 text-center max-w-md mb-8">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-[#e96a52] hover:bg-[#d75c46] text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
}
