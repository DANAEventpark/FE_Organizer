import React from 'react';
import { Star } from 'lucide-react';

const ReviewList = ({ reviews = [], averageRating, totalReviews }) => {
  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const avatarColors = ['#fca5a5', '#60a5fa', '#c084fc', '#fcd34d'];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#fef3c7] mt-6 lg:mt-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>Đánh giá sự kiện</span>
          <span className="text-sm font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
            {totalReviews || 0}
          </span>
        </h2>
        {averageRating && (
          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-bold text-yellow-700">{averageRating}/5</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {reviews.length > 0 ? (
          reviews.map((rev, idx) => (
            <div key={rev.id || idx} className="flex gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-800 shrink-0" 
                style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}
              >
                {getInitials(rev.user?.name)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">{rev.user?.name || 'Người dùng'}</h4>
                  <span className="text-xs text-gray-400">{rev.created_at}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Chưa có đánh giá nào cho sự kiện này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
