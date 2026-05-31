import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { organizerApi } from '../../api/organizer';

const CancelEventModal = ({ isOpen, onClose, onSuccess, eventData }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  if (!isOpen || !eventData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do hủy sự kiện");
      return;
    }
    setLoading(true);
    try {
      await organizerApi.cancelEvent(eventData.id, reason);
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi hủy sự kiện:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi hủy sự kiện");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md my-8 overflow-hidden shadow-xl">
        <div className="bg-red-50 p-6 flex flex-col items-center justify-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center">Hủy sự kiện</h2>
          <p className="text-sm text-red-600 text-center mt-1">
            Bạn có chắc chắn muốn hủy sự kiện "{eventData.title}"? Thao tác này không thể hoàn tác.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lý do hủy sự kiện</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng nhập lý do hủy sự kiện để thông báo cho người tham gia..."
              rows="4"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors text-sm resize-none"
              required
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
              Xác nhận hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelEventModal;
