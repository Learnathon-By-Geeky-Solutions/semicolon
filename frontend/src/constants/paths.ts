const validateEnvVar = (key: string, value: string | undefined): string => {
  if (!value) throw new Error(`${key} environment variable is not defined`);
  return value;
};

export const SERVER_URL = validateEnvVar('VITE_SERVER_URL', import.meta.env.VITE_SERVER_URL);
export const GOOGLE_MAPS_API_KEY = validateEnvVar('VITE_GOOGLE_MAPS_API_KEY', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);