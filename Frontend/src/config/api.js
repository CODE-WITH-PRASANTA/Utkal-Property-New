export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BLOGS: `${API_BASE_URL}/api/blogs`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  PROPERTIES: `${API_BASE_URL}/api/properties`,
  TEAM: `${API_BASE_URL}/api/team`,
  ENQUIRY: `${API_BASE_URL}/api/enquiry`,
  LEADS: `${API_BASE_URL}/api/leads`,
  SELL_RENT: `${API_BASE_URL}/api/sell-rent`,
  PROPERTY_REVIEWS: `${API_BASE_URL}/api/property-reviews`,
};

export const getMediaUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API_BASE_URL;
