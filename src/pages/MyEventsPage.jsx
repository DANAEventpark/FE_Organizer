import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { organizerApi } from '../api/organizer';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';



const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAction = (e, event, actionType) => {
    e.stopPropagation();
    if (event.status === 'done') {
      alert(`Sự kiện đã hoàn thành và bị khóa, bạn không thể ${actionType}.`);
      return;
    }
    console.log(`${actionType === 'chỉnh sửa' ? 'Edit' : 'Delete'} event`, event.id);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await organizerApi.getAllEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e96a52]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tất cả sự kiện</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên sự kiện</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đăng ký</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr 
                      key={event.id} 
                      onClick={() => navigate(`/events/${event.id}`)} 
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer" 
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 hover:text-[#e96a52] transition-colors">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-64" onClick={(e) => e.stopPropagation()}>
                        <ProgressBar current={event.registrations_count || 0} max={event.capacity || 0} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex gap-3">
                          <button 
                            onClick={(e) => handleAction(e, event, 'chỉnh sửa')} 
                            className={`transition-all ${event.status === 'done' ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:text-blue-500'}`}
                            title={event.status === 'done' ? "Sự kiện đã khóa" : "Chỉnh sửa"}
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleAction(e, event, 'xóa')} 
                            className={`transition-all ${event.status === 'done' ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:text-red-500'}`}
                            title={event.status === 'done' ? "Sự kiện đã khóa" : "Xóa"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Bạn chưa tạo sự kiện nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyEventsPage;
