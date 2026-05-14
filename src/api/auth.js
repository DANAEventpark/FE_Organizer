import client from './client';

export const loginApi = (data) => client.post('/auth/login', data);
export const logoutApi = () => client.post('/auth/logout');
export const getMeApi = () => client.get('/auth/me');
