import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ICalculationNode,
  ICreateStartingNumberInput,
  IApiResponse,
} from '../types/calculations.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useCreateStarting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICreateStartingNumberInput) => {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/calculations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create starting number');
      }

      const data: IApiResponse<ICalculationNode> = await response.json();
      return data.payload;
    },

    // Optimistic update
    onMutate: async (input) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['calculations'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<ICalculationNode[]>(['calculations']);

      // Get username from localStorage (set during login)
      const username = localStorage.getItem('username') || 'You';

      // Optimistically update
      queryClient.setQueryData<ICalculationNode[]>(['calculations'], (old = []) => [
        ...old,
        {
          id: Date.now(), // Temporary ID
          parent_id: null,
          user_id: 0,
          username,
          operation: 'start' as const,
          number: input.number,
          result: input.number,
          depth: 0,
          created_at: new Date().toISOString(),
          children: [],
          _optimistic: true,
        },
      ]);

      return { previous };
    },

    // Rollback on error
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['calculations'], context.previous);
      }
      console.error('Error creating starting number:', err);
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
    },
  });
};
