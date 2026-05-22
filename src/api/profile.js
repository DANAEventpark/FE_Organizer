import client from './client';

export const updateProfileInfoApi = (data) => client.put('/profile/info', data);
export const updatePasswordApi = (data) => client.put('/profile/password', data);
