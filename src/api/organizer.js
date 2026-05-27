
import client from './client';

export const organizerApi = {
  // Lấy các chỉ số thống kê tổng quan cho Dashboard
  getDashboardStats: async () => {
    const response = await client.get('/organizer/dashboard/stats');
    return response.data;
  },

  // Lấy danh sách 5 sự kiện gần nhất cho Dashboard
  getRecentEvents: async () => {
    const response = await client.get('/organizer/dashboard/events');
    return response.data;
  },

  // Lấy tất cả sự kiện của Organizer
  getAllEvents: async () => {
    const response = await client.get('/organizer/events');
    return response.data;
  },

  // Lấy dữ liệu chi tiết sự kiện 
  getEventDetail: async (id) => {
    const response = await client.get(`/organizer/events/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái sự kiện
  updateEventStatus: async (id, status) => {
    const response = await client.put(`/organizer/events/${id}/status`, { status });
    return response.data;
  }
};