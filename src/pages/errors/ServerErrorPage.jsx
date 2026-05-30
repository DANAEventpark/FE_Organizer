import { ServerCrash } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#173846] text-white p-4">
      <ServerCrash className="w-24 h-24 text-[#e96a52] mb-6" />
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2 text-center">Lỗi máy chủ</h2>
      <p className="text-white/70 text-center max-w-md mb-8">
        Hệ thống đang gặp sự cố hoặc đang được bảo trì. Vui lòng thử lại sau ít phút.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-[#e96a52] hover:bg-[#d75c46] text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Tải lại trang
      </button>
    </div>
  );
}
