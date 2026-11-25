import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, Users, Star, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { organizerApi } from '../api/organizer';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import EventModal from '../components/modals/EventModal';
import CancelEventModal from '../components/modals/CancelEventModal';

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

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({ total_events: 0, total_registrations: 0, average_rating: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        organizerApi.getDashboardStats(),
        organizerApi.getRecentEvents()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = async (e, event) => {
    e.stopPropagation();
    if (event.status === 'done') {
      alert('Sự kiện đã hoàn thành và bị khóa, bạn không thể chỉnh sửa.');
      return;
    }
    if (event.status === 'published') {
      alert('Không thể chỉnh sửa sự kiện đã được đăng.');
      return;
    }
    if (event.status === 'cancelled') {
      alert('Không thể chỉnh sửa sự kiện đã bị hủy.');
      return;
    }
    try {
      const res = await organizerApi.getEventDetail(event.id);
      setSelectedEvent(res?.success && res.data ? res.data : event);
    } catch {
      setSelectedEvent(event);
    }
    setIsEventModalOpen(true);
  };

  const handleDelete = (e, event) => {
    e.stopPropagation();
    if (event.status === 'done') {
      alert('Sự kiện đã hoàn thành và bị khóa, bạn không thể xóa.');
      return;
    }
    if (event.status === 'cancelled') {
      alert('Sự kiện đã bị hủy.');
      return;
    }
    setSelectedEvent(event);
    setIsCancelModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsEventModalOpen(false);
    setIsCancelModalOpen(false);
    setSelectedEvent(null);
    fetchData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">{t('dashboard.loading')}</div>
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
            <p className="text-gray-500">{t('dashboard.good_morning', { name: user?.name })}</p>
          </div>
          <Link
            to="/events?action=create"
            className="bg-[#e96a52] hover:bg-[#d75c46] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus size={20} />
            {t('dashboard.create_event')}
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={t('dashboard.total_events')}
            value={stats.total_events}
            icon={LayoutGrid}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard
            title={t('dashboard.registrations')}
            value={stats.total_registrations}
            icon={Users}
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
          />
          <StatCard
            title={t('dashboard.rating_points')}
            value={stats.average_rating}
            icon={Star}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-500"
          />
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">{t('dashboard.my_events_title')}</h2>
            <Link to="/events" className="text-[#e96a52] hover:text-[#d75c46] text-sm font-medium flex items-center gap-1">
              {t('dashboard.view_all')} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('dashboard.table.event_name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('dashboard.table.date')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('dashboard.table.registration')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('dashboard.table.status')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('dashboard.table.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length > 0 ? (
                  events.map((event) => {
                    const isEditDisabled = event.status === 'published' || event.status === 'cancelled' || event.status === 'done';
                    const isDeleteDisabled = event.status === 'cancelled' || event.status === 'done';

                    return (
                      <tr
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 hover:text-[#e96a52] transition-colors">
                          {event.title}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.start_time
                            ? new Date(event.start_time.replace(/-/g, '/')).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN')
                            : 'N/A'}
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
                              type="button"
                              onClick={(e) => handleEdit(e, event)}
                              className={`transition-all ${isEditDisabled ? 'text-gray-300 opacity-40 cursor-not-allowed' : 'hover:text-blue-500'}`}
                              title={
                                event.status === 'done'
                                  ? 'Sự kiện đã khóa'
                                  : event.status === 'published'
                                    ? 'Không thể chỉnh sửa sự kiện đã đăng'
                                    : event.status === 'cancelled'
                                      ? 'Không thể chỉnh sửa sự kiện đã hủy'
                                      : t('dashboard.table.edit')
                              }
                            >
                              <Edit size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, event)}
                              className={`transition-all ${isDeleteDisabled ? 'text-gray-300 opacity-40 cursor-not-allowed' : 'hover:text-red-500'}`}
                              title={
                                event.status === 'done'
                                  ? 'Sự kiện đã khóa'
                                  : event.status === 'cancelled'
                                    ? 'Sự kiện đã hủy'
                                    : t('dashboard.table.delete')
                              }
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                      {t('dashboard.table.no_events')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={selectedEvent}
      />

      <CancelEventModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSuccess={handleModalSuccess}
        eventData={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
