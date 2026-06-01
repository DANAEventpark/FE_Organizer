import { useTranslation } from 'react-i18next';

const EventInformation = ({ categoryName, location, startTime, endTime }) => {
    const { t, i18n } = useTranslation();
    // Hàm xử lý an toàn để tránh lỗi và sự khác biệt múi giờ giữa các trình duyệt
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        // Luôn thay thế '-' bằng '/' để đảm bảo trình duyệt luôn parse theo Local Time và không bị Invalid Date trên Safari
        const safeStr = typeof dateStr === 'string' ? dateStr.replace(/-/g, '/') : dateStr;
        const date = new Date(safeStr);
        return isNaN(date.getTime()) ? null : date;
    };

    const dateObj = parseDate(startTime);
    const endDateObj = parseDate(endTime);

    const formattedDate = dateObj ? dateObj.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN') : 'N/A';

    const formatTime = (dateObject) => {
        if (!dateObject) return '';
        return dateObject.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const isSameDay = dateObj && endDateObj && 
        dateObj.getFullYear() === endDateObj.getFullYear() &&
        dateObj.getMonth() === endDateObj.getMonth() &&
        dateObj.getDate() === endDateObj.getDate();

    const formatDateTimeCombo = (dateObject) => {
        if (!dateObject) return '';
        return `${formatTime(dateObject)}, ${dateObject.toLocaleDateString('vi-VN')}`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-2">{t('product_detail.info.title')}</h3>
            
            {/* Danh mục */}
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">📂</div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">{t('product_detail.info.category')}</p>
                    <p className="text-sm font-semibold text-gray-800">{categoryName || t('product_detail.category_unclassified')}</p>
                </div>
            </div>

            {/* Địa điểm */}
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">📍</div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">{t('product_detail.info.location')}</p>
                    <p className="text-sm font-semibold text-gray-800">{location || 'N/A'}</p>
                </div>
            </div>

            {isSameDay ? (
                <>
                    {/* Ngày diễn ra (Cùng ngày) */}
                    <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">📅</div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">{t('product_detail.info.date')}</p>
                            <p className="text-sm font-semibold text-gray-800">{formattedDate}</p>
                        </div>
                    </div>

                    {/* Thời gian (Cùng ngày) */}
                    <div className="flex items-start space-x-3">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">⏰</div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">{t('product_detail.info.time')}</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {dateObj && endDateObj ? `${formatTime(dateObj)} - ${formatTime(endDateObj)}` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                /* Kéo dài nhiều ngày */
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">📅</div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">{t('product_detail.info.date')} & {t('product_detail.info.time')}</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {dateObj ? formatDateTimeCombo(dateObj) : 'N/A'}
                            {endDateObj ? ` - ${formatDateTimeCombo(endDateObj)}` : ''}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventInformation;