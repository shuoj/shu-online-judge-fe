import axios from '@/api/axios'

export default {
  register: (data: {}) => axios.post('/api/v1/register', data),
  login: (data: {}) => axios.post('/api/v1/auth', data),
  refresh: (data: {}) => axios.post('/api/v1/refresh', data),
  getMyInfo: () => axios.get('/api/v1/me'),
  updateMyInfo: (data: {}) => axios.put('/api/v1/me', data),
  createUser: (data: {}) => axios.post('/api/v1/users', data),
  updateUserInfo: (data: { id: string }) =>
    axios.put(`/api/v1/users/${data.id}`, data),
  getUserInfo: (data: { id: string }) => axios.get(`/api/v1/users/${data.id}`),
}
