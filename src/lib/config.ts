export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In the browser, use the current location
    return window.location.origin;
  }
  
  // On the server, use environment variable or fallback to localhost
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  return 'http://localhost:3000';
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
