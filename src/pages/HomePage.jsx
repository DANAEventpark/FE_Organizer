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
        <span className="inline-block mt-4 px-4 py-2 bg-violet-600 text-white rounded-full text-sm">
          FE_Organizer — dev
        </span>
      </div>
    </div>
  )
}

export default HomePage
