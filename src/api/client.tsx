
import { ENV } from '@/core/env';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
