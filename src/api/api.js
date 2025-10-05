

// Base URL for your backend API
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// CONTACT ROUTES
export const CONTACT_API = {
  SEND_EMAIL: `${API_BASE_URL}/contact`,
};

// PROJECT ROUTES
export const PROJECT_API = {
  GET_ALL: `${API_BASE_URL}/projects`,
  GET_FEATURED: `${API_BASE_URL}/projects/featured`,
  CREATE: `${API_BASE_URL}/projects`,
};