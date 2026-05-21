import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Users, Star, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { organizerApi } from '../api/organizer';
import DashboardLayout from '../components/layout/DashboardLayout';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
      <Icon size={24} />
    </div>
  </div>
);

const ProgressBar = ({ current, max }) => {
  const percentage = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#e96a52] rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[50px]">{current}/{max}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch(status?.toLowerCase()) {
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' };
      case 'draft':
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
    }
  };
  
  const config = getStatusConfig();
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status || 'Unknown'}
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total_events: 0, total_registrations: 0, average_rating: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          organizerApi.getDashboardStats(),
          organizerApi.getRecentEvents()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (eventsRes.success) setEvents(eventsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">Chào buổi sáng, {user?.name} 👋</p>
          </div>
          <Link 
            to="/events/create" 
            className="bg-[#e96a52] hover:bg-[#d75c46] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus size={20} />
            Tạo sự kiện
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Tổng sự kiện" 
            value={stats.total_events} 
            icon={LayoutGrid} 
            iconBg="bg-blue-50" 
            iconColor="text-blue-500" 
          />
          <StatCard 
            title="Người đăng ký" 
            value={stats.total_registrations} 
            icon={Users} 
            iconBg="bg-purple-50" 
            iconColor="text-purple-500" 
          />
          <StatCard 
            title="Điểm đánh giá" 
            value={stats.average_rating} 
            icon={Star} 
            iconBg="bg-yellow-50" 
            iconColor="text-yellow-500" 
          />
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Sự kiện của tôi</h2>
            <Link to="/events" className="text-[#e96a52] hover:text-[#d75c46] text-sm font-medium flex items-center gap-1">
              Xem tất cả <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
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
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-64">
                        <ProgressBar current={event.registrations_count || 0} max={event.capacity || 0} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex gap-3">
                          <button className="hover:text-blue-500 transition-colors" title="Chỉnh sửa">
                            <Edit size={18} />
                          </button>
                          <button className="hover:text-red-500 transition-colors" title="Xóa">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Chưa có sự kiện nào
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

export default DashboardPage;
