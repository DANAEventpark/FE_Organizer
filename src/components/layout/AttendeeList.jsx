import  { useState } from 'react';

const AttendeeList = ({ confirmedUsers = [], waitlistUsers = [], confirmedCount, waitlistCount }) => {
    // Tab mặc định hiển thị ban đầu là danh sách chính thức 'confirmed'
    const [activeTab, setActiveTab] = useState('confirmed');

    // Xác định mảng dữ liệu sẽ dùng để hiển thị lên bảng dựa trên tab đang active
    const currentList = activeTab === 'confirmed' ? confirmedUsers : waitlistUsers;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-sm tracking-wide">NGƯỜI THAM DỰ</h3>
            
            {/* TABS CHUYỂN ĐỔI CHÍNH THỨC VÀ DANH SÁCH CHỜ */}
            <div className="flex space-x-6 border-b border-gray-100 mb-4 pb-2">
                <button 
                    onClick={() => setActiveTab('confirmed')}
                    className={`font-semibold text-sm pb-1 transition-all duration-200 ${
                        activeTab === 'confirmed' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Đã đăng ký ({confirmedCount})
                </button>
                <button 
                    onClick={() => setActiveTab('waitlist')}
                    className={`font-semibold text-sm pb-1 transition-all duration-200 ${
                        activeTab === 'waitlist' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Danh sách chờ ({waitlistCount})
                </button>
            </div>

            {/* BẢNG DỮ LIỆU HIỂN THỊ ĐỘNG */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead>
                        <tr className="text-gray-400 font-medium border-b border-gray-100 text-xs">
                            <th className="py-2 w-12 pl-2">#</th>
                            <th className="py-2">HỌ TÊN</th>
                            <th className="py-2">EMAIL</th>
                            <th className="py-2 text-right pr-2">NGÀY ĐĂNG KÝ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                        {currentList.length > 0 ? (
                            currentList.map((attendee, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 font-medium text-gray-400 pl-2">{index + 1}</td>
                                    <td className="py-3 font-semibold text-gray-800">{attendee.name}</td>
                                    <td className="py-3 text-gray-500">{attendee.email}</td>
                                    <td className="py-3 text-right text-gray-400 pr-2">{attendee.registered_at}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-400 italic">
                                    {activeTab === 'confirmed' 
                                        ? 'Chưa có thành viên nào đăng ký chính thức.' 
                                        : 'Hiện tại danh sách chờ đang trống.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
            <div className="flex justify-center items-center space-x-2 mt-4 text-[10px] text-gray-400">
                <button className="p-1 hover:text-gray-700">&lt;</button>
                <span className="text-gray-800 font-semibold">1</span>
                <button className="p-1 hover:text-gray-700">&gt;</button>
            </div>
        </div>
    );
};

export default AttendeeList;