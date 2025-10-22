import { useCalculations } from '../hooks/use-calculations';
import { CalculationNode } from './CalculationNode';
import { CreateStartingForm } from './CreateStartingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CalculationSkeleton = () => (
  <Card className="mb-4">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pb-3">
      <Skeleton className="h-6 w-48" />
    </CardContent>
  </Card>
);

export const CalculationTree = () => {
  const { data: calculations, isLoading, error } = useCalculations();
  const isAuthenticated = !!localStorage.getItem('token');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          <CalculationSkeleton />
          <CalculationSkeleton />
          <CalculationSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load calculations: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isAuthenticated && <CreateStartingForm />}

      {!isAuthenticated && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            Login or register to start new conversations
          </p>
        </div>
      )}

      {calculations && calculations.length > 0 ? (
        <div className="space-y-6">
          {calculations.map((calculation) => (
            <CalculationNode key={calculation.id} calculation={calculation} depth={0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No calculations yet.{' '}
            {isAuthenticated ? 'Start a new conversation above!' : 'Login to start a conversation!'}
          </p>
        </div>
      )}
    </div>
  );
};
