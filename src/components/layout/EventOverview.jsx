const EventOverview = ({ confirmedCount, capacity, waitlistCount, createdAt }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-gray-100">
      <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase flex items-center gap-2">
        📊 Tổng quan sự kiện
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Đã đăng ký</span>
          <span className="font-bold text-gray-800">{confirmedCount}/{capacity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Danh sách chờ</span>
          <span className="font-bold text-[#e96a52]">{waitlistCount}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 text-xs">
          <span className="text-gray-400">Ngày tạo sự kiện</span>
          <span className="font-medium text-gray-500">{createdAt || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EventOverview;