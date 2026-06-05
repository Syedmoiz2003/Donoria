const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.error || data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Request failed';
        throw new Error(errMsg);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async upload(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

const api = new ApiClient();

// Auth API
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
};

// Hospital API
export const hospitalApi = {
  getProfile: () => api.get('/hospitals/me'),
  updateProfile: (data) => api.put('/hospitals/me', data),
  uploadDocument: (formData) => api.upload('/hospitals/documents', formData),
  getDocuments: () => api.get('/hospitals/documents'),
  createRequest: (data) => api.post('/hospitals/requests', data),
  getRequests: () => api.get('/hospitals/requests'),
  getRequest: (id) => api.get(`/hospitals/requests/${id}`),
  updateRequest: (id, data) => api.put(`/hospitals/requests/${id}`, data),
  deleteRequest: (id) => api.delete(`/hospitals/requests/${id}`),
  getResponses: () => api.get('/hospitals/responses'),
  getInventory: () => api.get('/hospitals/inventory'),
  updateInventory: (data) => api.put('/hospitals/inventory', data),
};

// Donor API
export const donorApi = {
  getProfile: () => api.get('/donors/me'),
  createProfile: (data) => api.post('/donors/me', data),
  updateProfile: (data) => api.put('/donors/me', data),
  setAvailability: (isAvailable) => api.put('/donors/me/availability', { is_available: isAvailable }),
  getEligibility: () => api.get('/donors/me/eligibility'),
  getRequests: (filters) => api.get('/donors/requests', filters),
  getRequest: (id) => api.get(`/donors/requests/${id}`),
  uploadDocument: (formData) => api.upload('/donors/documents', formData),
  getDocuments: () => api.get('/donors/documents'),
  submitResponse: (data) => api.post('/donors/responses', data),
  getResponses: () => api.get('/donors/responses'),
  getResponse: (id) => api.get(`/donors/responses/${id}`),
  cancelResponse: (id) => api.delete(`/donors/responses/${id}`),
  getHistory: () => api.get('/donors/history'),
  chat: (message, sessionId) => api.post('/donors/chat', { message, session_id: sessionId }),
  getQuickResponses: (category) => api.get('/donors/chat/quick-responses', { category }),
  getHealthTips: () => api.get('/donors/health-tips'),
};

// Public Requests API
export const requestsApi = {
  getAll: (filters) => api.get('/requests', filters),
  getActive: () => api.get('/requests/active'),
  getUrgent: () => api.get('/requests/urgent'),
  getById: (id) => api.get(`/requests/${id}`),
  getResponses: (id) => api.get(`/requests/${id}/responses`),
  match: (id) => api.post(`/requests/${id}/match`),
};

// Responses API
export const responsesApi = {
  getAll: (filters) => api.get('/responses', filters),
  getById: (id) => api.get(`/responses/${id}`),
  accept: (id) => api.put(`/responses/${id}/accept`),
  complete: (id) => api.put(`/responses/${id}/complete`),
  reject: (id) => api.put(`/responses/${id}/reject`),
};

// Admin API
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (filters) => api.get('/admin/users', filters),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  getHospitals: (filters) => api.get('/admin/hospitals', filters),
  verifyHospital: (id) => api.put(`/admin/hospitals/${id}/verify`),
  rejectHospital: (id) => api.put(`/admin/hospitals/${id}/reject`),
  getDocuments: () => api.get('/admin/documents'),
  approveDocument: (id) => api.put(`/admin/documents/${id}/approve`),
  rejectDocument: (id, reason) => api.put(`/admin/documents/${id}/reject`, { rejection_reason: reason }),
  approveRequest: (id) => api.put(`/admin/requests/${id}/approve`),
  getReports: (type, startDate, endDate) => api.get('/admin/reports', { type, start_date: startDate, end_date: endDate }),
  getAnalytics: () => api.get('/admin/analytics'),
  getFeedback: () => api.get('/admin/feedback'),
  resolveFeedback: (id) => api.put(`/admin/feedback/${id}/resolve`),
  deleteFeedback: (id) => api.delete(`/admin/feedback/${id}`),
};

export const feedbackApi = {
  submit: (data) => api.post('/feedback', data),
};

export default api;
