import client from './client';

export const updateProfileInfoApi = (data) => client.put('/auth/profile/info', data);
export const updatePasswordApi = (data) => client.put('/auth/profile/password', data);
