import apiClient from './client';

export const userApi = {
    login: (username, email, password) =>
        apiClient.post('/user/login', { username, email, password }),

    signup: (username, email, password) =>
        apiClient.post('/user/signup', { username, email, password }),

    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    },
};
