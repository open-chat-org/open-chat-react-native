import axios, { AxiosHeaders } from 'axios';
import { get_ed25519_public_key } from '../services/storage/private-key.storage';
import { env } from './env';

export const api_client = axios.create({
  baseURL: env.backend_base_url,
});

api_client.interceptors.request.use(async (config) => {
  const public_key = await get_ed25519_public_key();
  const headers = AxiosHeaders.from(config.headers);

  headers.set('Accept', 'application/json');

  if (!headers.has('Content-Type') && config.data !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (public_key) {
    headers.set('x-public-key', public_key);
  }

  config.headers = headers;

  return config;
});

api_client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const response_message =
        typeof error.response?.data === 'string'
          ? error.response.data
          : typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message.join(', ')
              : error.message;

      return Promise.reject(new Error(response_message || 'Request failed.'));
    }

    return Promise.reject(error);
  },
);
