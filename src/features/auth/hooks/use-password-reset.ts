import { useMutation } from '@tanstack/react-query';
import type {
  IPasswordResetInput,
  IPasswordConfirmInput,
  IPasswordResetResponse,
} from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const usePasswordReset = () => {
  return useMutation({
    mutationFn: async (input: IPasswordResetInput) => {
      const response = await fetch(`${API_URL}/api/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Password reset request failed');
      }

      const data: IPasswordResetResponse = await response.json();
      return data.payload;
    },
  });
};

export const usePasswordConfirm = () => {
  return useMutation({
    mutationFn: async (input: IPasswordConfirmInput) => {
      const response = await fetch(`${API_URL}/api/auth/password-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Password reset confirmation failed');
      }

      return await response.json();
    },
  });
};
