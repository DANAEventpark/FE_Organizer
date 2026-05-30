import { useTranslation } from 'react-i18next';

const EventOverview = ({ confirmedCount, capacity, waitlistCount, createdAt }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-gray-100">
      <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase flex items-center gap-2">
        {t('product_detail.overview.title')}
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t('product_detail.overview.registered')}</span>
          <span className="font-bold text-gray-800">{confirmedCount}/{capacity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t('product_detail.overview.waitlist')}</span>
          <span className="font-bold text-[#e96a52]">{waitlistCount}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 text-xs">
          <span className="text-gray-400">{t('product_detail.overview.created_date')}</span>
          <span className="font-medium text-gray-500">
            {createdAt ? new Date(createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN') : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventOverview;