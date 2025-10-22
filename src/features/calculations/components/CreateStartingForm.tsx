import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createStartingNumberSchema,
  type CreateStartingNumberFormData,
} from '../schemas/calculations.schemas';
import { useCreateStarting } from '../hooks/use-create-starting';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type FormValues = CreateStartingNumberFormData;

export const CreateStartingForm = () => {
  const createStartingMutation = useCreateStarting();

  const form = useForm<FormValues>({
    resolver: zodResolver(createStartingNumberSchema),
    defaultValues: {
      number: 0,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createStartingMutation.mutateAsync({ number: data.number });
      toast.success('Starting number created successfully!');
      form.reset({ number: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create starting number';
      toast.error(message);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Start a New Conversation</CardTitle>
        <CardDescription>Enter a number to begin a new calculation thread</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter a number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createStartingMutation.isPending}>
              {createStartingMutation.isPending ? 'Creating...' : 'Create Starting Number'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
