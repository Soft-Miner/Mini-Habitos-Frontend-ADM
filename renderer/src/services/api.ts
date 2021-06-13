import axios from 'axios';
import { getStorage, removeStorage, setStorage } from '../utils/storage';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

const createAxiosResponseInterceptor = () => {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      api.interceptors.response.eject(interceptor);

      return api
        .post('/api/super_users/refresh_token', {
          refresh_token: getStorage('refresh_token'),
        })
        .then((response) => {
          const { access_token, refresh_token } = response.data;
          setStorage('access_token', access_token);
          setStorage('refresh_token', refresh_token);

          error.response.config.headers[
            'authorization'
          ] = `Bearer ${access_token}`;
          return axios(error.response.config);
        })
        .catch((error) => {
          removeStorage('access_token');
          removeStorage('refresh_token');

          window.location.href = '/login';

          return Promise.reject(error);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
};

createAxiosResponseInterceptor();

export default api;
