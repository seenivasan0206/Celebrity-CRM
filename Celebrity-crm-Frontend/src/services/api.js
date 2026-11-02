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

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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
    delete: (id) =>
      request(`/campaigns/${id}`, {
        method: 'DELETE'
      })
  },

  // Shoots Endpoints
  shoots: {
    getAll: () => request('/shoots'),
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
    delete: (id) =>
      request(`/shoots/${id}`, {
        method: 'DELETE'
      })
  },

  // Contracts Endpoints
  contracts: {
    getAll: () => request('/contracts'),
    create: (data) =>
      request('/contracts', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Managers Endpoints
  managers: {
    getAll: () => request('/managers'),
    create: (data) =>
      request('/managers', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Agencies Endpoints
  agencies: {
    getAll: () => request('/agencies'),
    create: (data) =>
      request('/agencies', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Reports & Analytics Endpoints
  reports: {
    getDashboard: () => request('/reports/dashboard')
  }
};

export default api;

