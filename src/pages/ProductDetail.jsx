import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, FolderOpen, Clock, Send, XCircle, Edit, Trash2 } from 'lucide-react';
import { organizerApi } from '../api/organizer'; 
import DashboardLayout from '../components/layout/DashboardLayout';

// Import chính xác theo cấu trúc thư mục thực tế của bạn (nằm trực tiếp trong components)
import EventInformation from '../components/layout/EventInformation';
import EventOverview from '../components/layout/EventOverview';
import AttendeeList from '../components/layout/AttendeeList';
import ReviewList from '../components/layout/ReviewList';
import EventModal from '../components/modals/EventModal';
import CancelEventModal from '../components/modals/CancelEventModal';

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    if (window.confirm(`Bạn có chắc muốn chuyển trạng thái sự kiện sang ${newStatus === 'published' ? 'xuất bản' : 'hủy'}?`)) {
      setUpdating(true);
      try {
        const res = await organizerApi.updateEventStatus(eventData.id, newStatus);
        if (res.success) {
          setEventData({ ...eventData, status: newStatus });
          alert(res.message);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
      } finally {
        setUpdating(false);
      }
    }
  };

  const fetchEventDetail = useCallback(async () => {
    try {
      let cleanId = id ? id.toString() : '';
      if (cleanId.includes(':')) {
        const parts = cleanId.split(':');
        cleanId = parts.find(part => part && !isNaN(part)) || parts[0];
      }
      cleanId = cleanId.trim();

      const response = await organizerApi.getEventDetail(cleanId);
      if (response.success) {
        setEventData(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sự kiện:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchEventDetail();
    }
  }, [id, fetchEventDetail]);

  const handlePublish = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng (publish) sự kiện này?")) {
      setActionLoading(true);
      try {
        await organizerApi.updateEvent(eventData.id, { status: 'published' });
        fetchEventDetail();
      } catch (error) {
        console.error("Lỗi khi publish:", error);
        alert("Lỗi khi đăng sự kiện");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleModalSuccess = () => {
    setIsEventModalOpen(false);
    setIsCancelModalOpen(false);
    fetchEventDetail();
  };

  // ─── TRANH TRẠNG LOADING RESPONSIVE 
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] text-gray-500 font-medium px-4">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#e96a52] mb-3"></div>
          <p className="text-sm text-center">Đang tải thông tin chi tiết sự kiện...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ─── TRẠNG THÁI LỖI KHÔNG TÌM THẤY DỮ LIỆU 
  if (!eventData) {
    return (
      <DashboardLayout>
        <div className="p-6 sm:p-8 text-center max-w-md mx-auto mt-12 sm:mt-20 bg-white rounded-2xl shadow-sm border border-gray-100 mx-4 sm:mx-auto">
          <div className="text-4xl mb-3"></div>
          <p className="text-gray-600 font-semibold mb-2 text-base">Không tìm thấy dữ liệu sự kiện!</p>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Vui lòng kiểm tra lại đường dẫn hoặc sự kiện này có thể đã bị xóa khỏi hệ thống.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-[#e96a52] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#d75c46] transition-colors shadow-sm"
          >
            Quay lại Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ─── GIAO DIỆN CHÍNH CHUẨN RESPONSIVE ──────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FDFBF7] min-h-[calc(100vh-64px)]">
        
        {/* Breadcrumb điều hướng */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-none">
            {eventData.title}
          </span>
        </div>

        {/* Khối Header: Tiêu đề & Nút Thao tác */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-2 w-full lg:max-w-3xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-950 tracking-tight break-words">
              {eventData.title}
            </h1>
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                eventData.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${eventData.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {eventData.status || 'Draft'}
              </span>
              <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] px-3 py-0.5 rounded-full font-medium">
                {eventData.category_name || 'Chưa phân loại'}
              </span>
            </div>
          </div>

          {/* Nhóm Nút bấm Co giãn theo màn hình  */}
          <div className="flex items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t border-gray-50 lg:border-none">
            {eventData.status === 'draft' && (
              <button 
                onClick={() => handleUpdateStatus('published')}
                disabled={updating}
                className="flex-1 lg:flex-none bg-[#e96a52] hover:bg-[#d75c46] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap disabled:opacity-50"
              >
                <Send size={16} /> Xuất bản (Publish)
              </button>
            )}
            
            {eventData.status !== 'published' && eventData.status !== 'cancelled' && eventData.status !== 'done' && (
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="flex-1 lg:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap"
              >
                <Edit size={16} /> Chỉnh sửa
              </button>
            )}

            {eventData.status !== 'cancelled' && eventData.status !== 'done' && (
              <button 
                onClick={() => setIsCancelModalOpen(true)}
                className="flex-1 lg:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-red-100 transition-colors whitespace-nowrap"
              >
                <Trash2 size={16} /> Hủy sự kiện
              </button>
            )}

            {eventData.status === 'done' && (
              <button 
                disabled={true}
                className="flex-1 lg:flex-none bg-gray-100 text-gray-400 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed whitespace-nowrap"
              >
                Sự kiện đã kết thúc
              </button>
            )}
            
            {eventData.status === 'cancelled' && (
              <button 
                disabled={true}
                className="flex-1 lg:flex-none bg-red-50 text-red-400 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-red-100 whitespace-nowrap"
              >
                Sự kiện đã hủy
              </button>
            )}
          </div>
        </div>

   
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
  
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-2 lg:order-1">
            
            {/* Khối mô tả sự kiện */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2">
                📝 Mô tả chi tiết sự kiện
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words">
                {eventData.description || "Chưa có mô tả chi tiết cụ thể cho sự kiện này."}
              </p>
            </div>

            {/* Khối danh sách người tham gia  */}
            <AttendeeList 
              confirmedUsers={eventData.confirmed_users || []}
              waitlistUsers={eventData.waitlist_users || []}
              confirmedCount={eventData.confirmed_count || 0}
              waitlistCount={eventData.waitlist_count || 0}
            />

            {/* Khối Danh sách đánh giá từ người dùng */}
            <ReviewList 
              reviews={eventData.reviews || []}
              averageRating={eventData.average_rating}
              totalReviews={eventData.total_reviews}
            />
          </div>

        
          <div className="space-y-6 order-1 lg:order-2">
            
            {/* Gọi Component Thông tin chi tiết địa điểm, thời gian */}
            <EventInformation 
              categoryName={eventData.category_name}
              location={eventData.location}
              startTime={eventData.start_time}
              endTime={eventData.end_time}
            />
            
            {/* Gọi Component Tổng quan số lượng số vé, danh sách chờ */}
            <EventOverview 
              confirmedCount={eventData.confirmed_count || 0}
              capacity={eventData.capacity || 0}
              waitlistCount={eventData.waitlist_count || 0}
              createdAt={eventData.created_at}
            />
          </div>

        </div>
      </div>

      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={eventData}
      />

      <CancelEventModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSuccess={handleModalSuccess}
        eventData={eventData}
      />
    </DashboardLayout>
  );
};

export default ProductDetail;