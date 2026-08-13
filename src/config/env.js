const getEnvVar = (key, fallback = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key] !== undefined) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return fallback;
};

export const ENV = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://natours-api-906g.onrender.com/api/v1'),
  API_SERVER_URL: getEnvVar('VITE_API_SERVER_URL', 'https://natours-api-906g.onrender.com'),
  RAZORPAY_KEY_ID: getEnvVar('VITE_RAZORPAY_KEY_ID', 'rzp_test_1DP5mmOlF5G5ag'),
};

export default ENV;
