export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/update-profile",
  },
  INVOICE: {
    CREATE: "/api/invoices",
    GET_ALL_INVOICES: "/api/invoices",
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`,
    UPDATE_INVOICE: (id) => `/api/invoices/${id}`,
    DELETE_INVOICE: (id) => `/api/invoices/${id}`,
  },
  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-invoice",
    GENERATE_REMINDER_EMAIL: "/api/ai/generate-reminder-email",
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary",
  },
};
