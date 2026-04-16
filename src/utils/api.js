import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS, STORAGE_KEYS } from "../constants";

// Get auth token from storage
const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

// Build headers with optional auth
const buildHeaders = (includeAuth = false) => {
  const headers = { ...DEFAULT_HEADERS };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic fetch wrapper
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
};

// ==================== Config Master APIs ====================

// GET /config_master?config_type={type} - Get configurations
export const getConfigurations = async (configType, includeAuth = false) => {
  const endpoint = `${ENDPOINTS.CONFIG_MASTER}?config_type=${encodeURIComponent(configType)}`;
  return fetchApi(endpoint, {
    method: "GET",
    headers: buildHeaders(includeAuth),
  });
};

// POST /config_master - Create new configuration
export const createConfiguration = async (payload, includeAuth = true) => {
  return fetchApi(ENDPOINTS.CONFIG_MASTER, {
    method: "POST",
    headers: buildHeaders(includeAuth),
    body: JSON.stringify(payload),
  });
};

// PUT /config_master/{id} - Update configuration
export const updateConfiguration = async (id, payload, includeAuth = true) => {
  const endpoint = `${ENDPOINTS.CONFIG_MASTER}/${id}`;
  return fetchApi(endpoint, {
    method: "PUT",
    headers: buildHeaders(includeAuth),
    body: JSON.stringify(payload),
  });
};

// GET /config_master/{id} - Get single configuration by ID
export const getConfigurationById = async (id, includeAuth = true) => {
  const endpoint = `${ENDPOINTS.CONFIG_MASTER}/${id}`;
  return fetchApi(endpoint, {
    method: "GET",
    headers: buildHeaders(includeAuth),
  });
};

// ==================== Auth APIs ====================

// POST /login - Login user
export const loginUser = async (credentials) => {
  const response = await fetchApi(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(credentials),
  });

  // Store token on successful login
  if (response.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId);
  }

  return response;
};

// POST /signup - Sign up user
export const signupUser = async (userData) => {
  const response = await fetchApi(ENDPOINTS.SIGNUP, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(userData),
  });

  // Store token on successful signup
  if (response.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId);
  }

  return response;
};

// Logout - Clear stored auth data
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get stored user ID
export const getUserId = () => localStorage.getItem(STORAGE_KEYS.USER_ID);

// ==================== Dashboard APIs (No Auth Required) ====================

// POST /dashboard - Create new dashboard
export const createDashboard = async (data) => {
  return fetchApi(ENDPOINTS.DASHBOARD, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ data }),
  });
};

// GET /dashboard/{id} - Get dashboard by ID
export const getDashboard = async (id) => {
  const endpoint = `${ENDPOINTS.DASHBOARD}/${id}`;
  return fetchApi(endpoint, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });
};

// PUT /dashboard/{id} - Update dashboard by ID
export const updateDashboard = async (id, data) => {
  const endpoint = `${ENDPOINTS.DASHBOARD}/${id}`;
  return fetchApi(endpoint, {
    method: "PUT",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ data }),
  });
};
