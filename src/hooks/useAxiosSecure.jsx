import { useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqId = axiosSecure.interceptors.request.use(
      async (config) => {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          config.headers.authorization = `Bearer ${localToken}`;
        } else if (user) {
          try {
            const token = await user.getIdToken();
            config.headers.authorization = `Bearer ${token}`;
          } catch {
            // Token retrieval fallback
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resId = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 403) navigate('/forbidden');

        if (status === 401) {
          try {
            await logOut();
            navigate('/login');
          } catch (err) {
            console.error('Error during logout:', err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqId);
      axiosSecure.interceptors.response.eject(resId);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
