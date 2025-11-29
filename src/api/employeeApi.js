import apiClient from './client';

export const employeeApi = {
    list: (query) => apiClient.get('/emp/employees', {
        params: query ? { query } : {}
    }),

    getById: (id) => apiClient.get(`/emp/employees/${id}`),

    create: (body) =>
        apiClient.post('/emp/employees', body),

    update: (id, body) =>
        apiClient.put(`/emp/employees/${id}`, body),

    delete: (id) =>
        apiClient.delete(`/emp/employees`, {
            params: {
                eid: id
            }
        })
};
