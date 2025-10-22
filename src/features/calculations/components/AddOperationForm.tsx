import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addOperationSchema, type AddOperationFormData } from '../schemas/calculations.schemas';
import { useAddOperation } from '../hooks/use-add-operation';
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

interface AddOperationFormProps {
  parentId: number;
  operation: '+' | '-' | '*' | '/';
  onSuccess: () => void;
  onCancel: () => void;
}

type FormValues = AddOperationFormData;

export const AddOperationForm = ({
  parentId,
  operation,
  onSuccess,
  onCancel,
}: AddOperationFormProps) => {
  const addOperationMutation = useAddOperation();

  const form = useForm<FormValues>({
    resolver: zodResolver(addOperationSchema),
    defaultValues: {
      number: 0,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await addOperationMutation.mutateAsync({
        parentId,
        operation,
        number: data.number,
      });
      toast.success('Operation added successfully!');
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add operation';
      toast.error(message);
    }
  };

  const getOperationLabel = () => {
    switch (operation) {
      case '+':
        return 'Add';
      case '-':
        return 'Subtract';
      case '*':
        return 'Multiply';
      case '/':
        return 'Divide';
      default:
        return 'Operation';
    }
  };

  return (
    <div className="w-full space-y-4">
      <h4 className="font-semibold">{getOperationLabel()} Operation</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter a number</FormLabel>
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
          <div className="flex gap-2">
            <Button type="submit" disabled={addOperationMutation.isPending}>
              {addOperationMutation.isPending ? 'Adding...' : 'Submit'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
