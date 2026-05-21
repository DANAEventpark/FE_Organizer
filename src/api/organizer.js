import client from './client';

export const organizerApi = {
  getDashboardStats: async () => {
    const response = await client.get('/organizer/dashboard/stats');
    return response.data;
  },

  getRecentEvents: async () => {
    const response = await client.get('/organizer/dashboard/events');
    return response.data;
  }
};
