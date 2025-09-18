let rawUrl = process.env.REACT_APP_BASE_URL || '';
export const API_URL = rawUrl.replace(/\/+$/, ''); // remove trailing slashes
console.log('Sanitized API_URL:', API_URL);
