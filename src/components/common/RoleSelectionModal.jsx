import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function RoleSelectionModal({ isOpen, onClose, actionType }) {
  if (!isOpen) return null;

  const attendeeUrl = actionType === "register" ? "http://localhost:5173/register" : "http://localhost:5173/login";
  const organizerUrl = actionType === "register" ? "http://localhost:5174/register" : "http://localhost:5174/login";

  const title = actionType === "register" ? "Bạn muốn đăng ký với vai trò nào?" : "Bạn muốn đăng nhập với vai trò nào?";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-8">
          {title}
        </h2>

        {/* Role Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={attendeeUrl}
            className="flex-1 rounded-xl bg-[#e96a52] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-[#d75c46] hover:scale-105 transition-all duration-200"
          >
            Người tham gia
          </a>
          <a
            href={organizerUrl}
            className="flex-1 rounded-xl bg-[#e96a52] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-[#d75c46] hover:scale-105 transition-all duration-200"
          >
            Ban tổ chức
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
