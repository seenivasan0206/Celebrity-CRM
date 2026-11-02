/**
 * ZENVE CRM — API Client Service
 * Connects the React Frontend with the Spring Boot Backend (http://localhost:8080)
 */

const BASE_URL = '/api'; // Proxied through Vite to http://localhost:8080

// Helper to retrieve the current JWT token
function getAuthHeaders() {
  const token = localStorage.getItem('zenve_auth_token') || sessionStorage.getItem('zenve_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Generic Request Wrapper
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  // If uploading FormData, delete Content-Type to let fetch automatically set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let msg = errorData.message || errorData.error;
      if (errorData.errors && typeof errorData.errors === 'object') {
        const details = Object.entries(errorData.errors)
          .map(([k, v]) => `${v}`)
          .join(', ');
        if (details) {
          msg = details;
        }
      }
      throw new Error(msg || `Server error (${response.status}: ${response.statusText})`);
    }
    // Return null for 204 No Content
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.warn(`[API] Failed request to ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication Endpoints
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getCurrentUser: () => request('/auth/me')
  },

  // Celebrities Endpoints
  celebrities: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/celebrities${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/celebrities/${id}`),
    create: (data) =>
      request('/celebrities', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/celebrities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/celebrities/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/celebrities/${id}`, {
        method: 'DELETE'
      })
  },

  // Campaigns Endpoints
  campaigns: {
    getAll: () => request('/campaigns'),
    getById: (id) => request(`/campaigns/${id}`),
    create: (data) =>
      request('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/campaigns/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/campaigns/${id}`, {
        method: 'DELETE'
      })
  },

  // Shoots Endpoints
  shoots: {
    getAll: () => request('/shoots'),
    getById: (id) => request(`/shoots/${id}`),
    create: (data) =>
      request('/shoots', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/shoots/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/shoots/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/shoots/${id}`, {
        method: 'DELETE'
      })
  },

  // Contracts Endpoints
  contracts: {
    getAll: () => request('/contracts'),
    getById: (id) => request(`/contracts/${id}`),
    create: (data) =>
      request('/contracts', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/contracts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/contracts/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/contracts/${id}`, {
        method: 'DELETE'
      })
  },

  // Managers Endpoints
  managers: {
    getAll: () => request('/managers'),
    getById: (id) => request(`/managers/${id}`),
    create: (data) =>
      request('/managers', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/managers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/managers/${id}`, {
        method: 'DELETE'
      })
  },

  // Agencies Endpoints
  agencies: {
    getAll: () => request('/agencies'),
    getById: (id) => request(`/agencies/${id}`),
    create: (data) =>
      request('/agencies', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/agencies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/agencies/${id}`, {
        method: 'DELETE'
      })
  },

  // Casting Calls & Applications Endpoints
  casting: {
    getCalls: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/casting/calls${query ? `?${query}` : ''}`);
    },
    getCallById: (id) => request(`/casting/calls/${id}`),
    createCall: (data) =>
      request('/casting/calls', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateCall: (id, data) =>
      request(`/casting/calls/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateCallStatus: (id, status) =>
      request(`/casting/calls/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    deleteCall: (id) =>
      request(`/casting/calls/${id}`, {
        method: 'DELETE'
      }),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/casting/applications${query ? `?${query}` : ''}`);
    },
    getApplicationById: (id) => request(`/casting/applications/${id}`),
    createApplication: (data) =>
      request('/casting/applications', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateApplication: (id, data) =>
      request(`/casting/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateApplicationStatus: (id, status) =>
      request(`/casting/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    deleteApplication: (id) =>
      request(`/casting/applications/${id}`, {
        method: 'DELETE'
      })
  },

  // OTT & Streaming Projects Endpoints
  ott: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/ott/projects${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/ott/projects/${id}`),
    create: (data) =>
      request('/ott/projects', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/ott/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/ott/projects/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/ott/projects/${id}`, {
        method: 'DELETE'
      })
  },

  // Secure Document & Media Vault Endpoints
  files: {
    getAll: () => request('/files'),
    getById: (id) => request(`/files/${id}`),
    upload: (formData) =>
      request('/files/upload', {
        method: 'POST',
        body: formData
      }),
    delete: (fileName) =>
      request(`/files/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      }),
    deleteById: (id) =>
      request(`/files/id/${id}`, {
        method: 'DELETE'
      }),
    getDownloadUrl: (fileName) => `/api/files/download/${encodeURIComponent(fileName)}`,
    getViewUrl: (fileName) => `/api/files/view/${encodeURIComponent(fileName)}`
  },

  // Portal Settings & Configuration Endpoints
  settings: {
    getAll: () => request('/settings'),
    getProfile: () => request('/settings/profile'),
    updateProfile: (data) =>
      request('/settings/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getTheme: () => request('/settings/theme'),
    updateTheme: (data) =>
      request('/settings/theme', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getNotifications: () => request('/settings/notifications'),
    updateNotifications: (data) =>
      request('/settings/notifications', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    changePassword: (data) =>
      request('/settings/password', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getSubscription: () => request('/settings/subscription'),
    updateSubscription: (data) =>
      request('/settings/subscription', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  // Reports & Analytics Endpoints
  reports: {
    getDashboard: () => request('/reports/dashboard'),
    getCelebrities: () => request('/reports/celebrities'),
    getAgencies: () => request('/reports/agencies'),
    getCampaigns: () => request('/reports/campaigns'),
    getShoots: () => request('/reports/shoots'),
    getContracts: () => request('/reports/contracts'),
    getOttProjects: () => request('/reports/ott-projects')
  }
};

export default api;

