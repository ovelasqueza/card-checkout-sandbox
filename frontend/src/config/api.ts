// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:57116',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Configuración de axios por defecto
export const createApiConfig = () => ({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});