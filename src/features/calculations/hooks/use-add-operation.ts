import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ICalculationNode,
  IAddOperationInput,
  IApiResponse,
} from '../types/calculations.types';
import { calculateResult } from '../utils/calculations.utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AddOperationMutationInput extends IAddOperationInput {
  parentId: number;
}

export const useAddOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentId, operation, number }: AddOperationMutationInput) => {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/calculations/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation, number }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add operation');
      }

      const data: IApiResponse<ICalculationNode> = await response.json();
      return data.payload;
    },

    // Optimistic update
    onMutate: async ({ parentId, operation, number }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['calculations'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<ICalculationNode[]>(['calculations']);

      // Get username from localStorage
      const username = localStorage.getItem('username') || 'You';

      // Find parent node and calculate optimistic result
      const findNode = (nodes: ICalculationNode[], id: number): ICalculationNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          const found = findNode(node.children, id);
          if (found) return found;
        }
        return null;
      };

      const parent = previous ? findNode(previous, parentId) : null;

      if (parent) {
        const optimisticResult = calculateResult(parent.result, operation, number);
        const optimisticNode: ICalculationNode = {
          id: Date.now(), // Temporary ID
          parent_id: parentId,
          user_id: 0,
          username,
          operation,
          number,
          result: optimisticResult,
          depth: parent.depth + 1,
          created_at: new Date().toISOString(),
          children: [],
          _optimistic: true,
        };

        // Add optimistic node to parent's children
        const addChildToNode = (
          nodes: ICalculationNode[],
          targetId: number,
          child: ICalculationNode
        ): ICalculationNode[] => {
          return nodes.map((node) => {
            if (node.id === targetId) {
              return { ...node, children: [...node.children, child] };
            }
            return { ...node, children: addChildToNode(node.children, targetId, child) };
          });
        };

        queryClient.setQueryData<ICalculationNode[]>(['calculations'], (old = []) =>
          addChildToNode(old, parentId, optimisticNode)
        );
      }

      return { previous };
    },

    // Rollback on error
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['calculations'], context.previous);
      }
      console.error('Error adding operation:', err);
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
    },
  });
};
