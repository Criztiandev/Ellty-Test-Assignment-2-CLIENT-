import { useState } from 'react';
import type { ICalculationNode } from '../types/calculations.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '../utils/calculations.utils';
import { AddOperationForm } from './AddOperationForm';
import { cn } from '@/lib/utils';

interface CalculationNodeProps {
  calculation: ICalculationNode;
  depth: number;
}

export const CalculationNode = ({ calculation, depth }: CalculationNodeProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<'+' | '-' | '*' | '/' | null>(null);
  const isAuthenticated = !!localStorage.getItem('token');
  const canReply = isAuthenticated && calculation.depth < 50;

  const handleReply = (operation: '+' | '-' | '*' | '/') => {
    setSelectedOperation(operation);
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setSelectedOperation(null);
  };

  const handleSuccessReply = () => {
    setIsReplying(false);
    setSelectedOperation(null);
  };

  // For operations, we need to reconstruct the parent result
  const getParentResult = () => {
    if (calculation.operation === 'start') return calculation.number;

    switch (calculation.operation) {
      case '+':
        return calculation.result - calculation.number;
      case '-':
        return calculation.result + calculation.number;
      case '*':
        return calculation.result / calculation.number;
      case '/':
        return calculation.result * calculation.number;
      default:
        return 0;
    }
  };

  return (
    <div className={cn('mb-4', depth > 0 && 'ml-8 border-l-2 border-gray-300 pl-4')}>
      <Card className={cn(calculation._optimistic && 'opacity-60')}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
              {calculation.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{calculation.username}</p>
              <p className="text-sm text-muted-foreground">{formatDate(calculation.created_at)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {calculation.operation === 'start' ? (
            <div className="text-lg">
              <span className="text-sm text-muted-foreground">Starting number: </span>
              <span className="font-mono font-bold text-2xl">{calculation.number}</span>
            </div>
          ) : (
            <div className="text-lg font-mono">
              <span className="text-muted-foreground">{getParentResult()}</span>{' '}
              <span className="font-bold text-blue-600">{calculation.operation}</span>{' '}
              <span className="font-bold">{calculation.number}</span>
              {' = '}
              <span className="font-bold text-green-600">{calculation.result}</span>
            </div>
          )}
        </CardContent>

        {canReply && !isReplying && (
          <CardFooter className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleReply('+')}>
              + Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReply('-')}>
              - Subtract
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReply('*')}>
              × Multiply
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReply('/')}>
              ÷ Divide
            </Button>
          </CardFooter>
        )}

        {isReplying && selectedOperation && (
          <CardFooter>
            <AddOperationForm
              parentId={calculation.id}
              operation={selectedOperation}
              onSuccess={handleSuccessReply}
              onCancel={handleCancelReply}
            />
          </CardFooter>
        )}

        {!canReply && isAuthenticated && calculation.depth >= 50 && (
          <CardFooter className="text-sm text-muted-foreground">
            Maximum depth reached (50 levels)
          </CardFooter>
        )}

        {!isAuthenticated && (
          <CardFooter className="text-sm text-muted-foreground">
            Login to reply to this conversation
          </CardFooter>
        )}
      </Card>

      {/* Recursively render children */}
      {calculation.children.length > 0 && (
        <div className="mt-4">
          {calculation.children.map((child) => (
            <CalculationNode key={child.id} calculation={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
