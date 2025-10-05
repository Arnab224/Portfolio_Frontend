

// Base URL for your backend API
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// CONTACT ROUTES
export const CONTACT_API = {
  SEND_EMAIL: `${VITE_API_BASE_URL}/contact`,
};

// PROJECT ROUTES
export const PROJECT_API = {
  GET_ALL: `${VITE_API_BASE_URL}/projects`,
  GET_FEATURED: `${VITE_API_BASE_URL}/projects/featured`,
  CREATE: `${VITE_API_BASE_URL}/projects`,
};