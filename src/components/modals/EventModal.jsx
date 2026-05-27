import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { organizerApi } from '../../api/organizer';
import client from '../../api/client'; // Dùng để fetch categories

const EventModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    capacity: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    location: '',
    description: '',
    image: '',
    status: 'draft'
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await client.get('/categories');
        if (response.data && response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh mục", error);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Format datetime-local requires YYYY-MM-DDThh:mm
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          // Kiểm tra xem dateString có phải YYYY-MM-DD HH:mm:ss không
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return '';
          return d.toISOString().slice(0, 16);
        };

        setFormData({
          title: initialData.title || '',
          category_id: initialData.category_id || '',
          capacity: initialData.capacity || '',
          start_time: formatDateForInput(initialData.start_time),
          end_time: formatDateForInput(initialData.end_time),
          registration_deadline: formatDateForInput(initialData.registration_deadline),
          location: initialData.location || '',
          description: initialData.description || '',
          image: initialData.image || '',
          status: initialData.status || 'draft'
        });
      } else {
        setFormData({
          title: '',
          category_id: '',
          capacity: '',
          start_time: '',
          end_time: '',
          registration_deadline: '',
          location: '',
          description: '',
          image: '',
          status: 'draft'
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Format data for API (Laravel expects YYYY-MM-DD HH:mm:ss ideally, but ISO string works or just let browser send it)
      const dataToSubmit = {
        ...formData,
        start_time: formData.start_time.replace('T', ' ') + ':00',
        end_time: formData.end_time.replace('T', ' ') + ':00',
        registration_deadline: formData.registration_deadline ? formData.registration_deadline.replace('T', ' ') + ':00' : null,
      };

      if (isUpdate) {
        await organizerApi.updateEvent(initialData.id, dataToSubmit);
      } else {
        await organizerApi.createEvent(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu sự kiện");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-red-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{isUpdate ? 'Cập nhật sự kiện' : 'Tạo sự kiện mới'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên sự kiện</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên sự kiện"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm bg-white"
                required
              >
                <option value="">Danh mục</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lượt đăng ký (Sức chứa)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày kết thúc</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hạn đăng ký</label>
              <input
                type="datetime-local"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isUpdate && initialData?.status === 'published'}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm bg-white disabled:bg-gray-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa điểm</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Nhập địa điểm diễn ra sự kiện"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ảnh bìa (URL)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Viết mô tả"
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] transition-colors text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-lg bg-[#e96a52] hover:bg-[#d75c46] text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
              {isUpdate ? 'Cập nhật' : 'Tạo sự kiện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
