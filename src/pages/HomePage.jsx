import { Link } from 'react-router-dom';

/**
 * HomePage — FE_Organizer
 * Placeholder cho trang chủ ban tổ chức
 * Sẽ được phát triển đầy đủ trong các REQ tiếp theo
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🎪 DANAEventpark
        </h1>
        <p className="text-slate-400 text-lg">
          Cổng quản lý sự kiện dành cho Ban Tổ Chức
        </p>
        <div className="flex flex-col items-center gap-4 mt-6">
          <span className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm">
            FE_Organizer — dev
          </span>
          
          <div className="flex gap-4 mt-4">
            <Link 
              to="/login" 
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

