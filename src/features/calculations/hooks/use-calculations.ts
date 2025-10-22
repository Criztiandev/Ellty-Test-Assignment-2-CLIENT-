import { useQuery } from '@tanstack/react-query';
import type { ICalculationNode, IApiResponse } from '../types/calculations.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useCalculations = () => {
  return useQuery<ICalculationNode[]>({
    queryKey: ['calculations'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/calculations`);

      if (!response.ok) {
        throw new Error('Failed to fetch calculations');
      }

      const data: IApiResponse<ICalculationNode[]> = await response.json();
      return data.payload;
    },
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
    staleTime: 2000, // Consider data stale after 2 seconds
  });
};
