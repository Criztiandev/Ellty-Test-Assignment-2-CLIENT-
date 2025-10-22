import { useMutation } from '@tanstack/react-query';
import type { ILoginInput, IRegisterInput, IAuthResponse } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (input: ILoginInput) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data: IAuthResponse = await response.json();

      // Store token and user info in localStorage
      localStorage.setItem('token', data.payload.token);
      localStorage.setItem('username', data.payload.user.username);
      localStorage.setItem('userId', data.payload.user.id.toString());

      return data.payload;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (input: IRegisterInput) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data: IAuthResponse = await response.json();

      // Store token and user info in localStorage
      localStorage.setItem('token', data.payload.token);
      localStorage.setItem('username', data.payload.user.username);
      localStorage.setItem('userId', data.payload.user.id.toString());

      return data.payload;
    },
  });
};

export const useLogout = () => {
  return () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };
};
