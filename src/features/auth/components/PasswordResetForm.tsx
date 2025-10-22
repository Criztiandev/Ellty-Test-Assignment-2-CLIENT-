import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  passwordResetSchema,
  passwordConfirmSchema,
  type PasswordResetFormData,
  type PasswordConfirmFormData,
} from '../schemas/auth.schemas';
import { usePasswordReset, usePasswordConfirm } from '../hooks/use-password-reset';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const passwordResetMutation = usePasswordReset();
  const passwordConfirmMutation = usePasswordConfirm();

  const resetForm = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      username: '',
    },
  });

  const confirmForm = useForm<PasswordConfirmFormData>({
    resolver: zodResolver(passwordConfirmSchema),
    defaultValues: {
      token: '',
      new_password: '',
    },
  });

  const onRequestReset = async (data: PasswordResetFormData) => {
    try {
      const result = await passwordResetMutation.mutateAsync(data);
      setResetToken(result.token);
      // Auto-fill the token in the second form
      confirmForm.setValue('token', result.token);
      toast.success('Reset token generated and auto-filled below!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset request failed';
      toast.error(message);
    }
  };

  const copyTokenToClipboard = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken);
      toast.success('Token copied to clipboard!');
    }
  };

  const onConfirmReset = async (data: PasswordConfirmFormData) => {
    try {
      await passwordConfirmMutation.mutateAsync(data);
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password - Step 1</CardTitle>
          <CardDescription>Enter your username to generate a reset token</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onRequestReset)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={passwordResetMutation.isPending}>
                {passwordResetMutation.isPending ? 'Generating...' : 'Generate Reset Token'}
              </Button>
            </form>
          </Form>

          {resetToken && (
            <Alert className="mt-4">
              <AlertDescription>
                <div className="space-y-2">
                  <strong>Your reset token:</strong>
                  <div className="flex items-center gap-2">
                    <code className="text-xs break-all flex-1 p-2 bg-muted rounded">
                      {resetToken}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={copyTokenToClipboard}
                    >
                      Copy
                    </Button>
                  </div>
                  <small className="text-muted-foreground block">
                    Token auto-filled below. It expires in 15 minutes.
                  </small>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password - Step 2</CardTitle>
          <CardDescription>Use the reset token to set a new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...confirmForm}>
            <form onSubmit={confirmForm.handleSubmit(onConfirmReset)} className="space-y-4">
              <FormField
                control={confirmForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Token</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste your reset token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={confirmForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={passwordConfirmMutation.isPending}>
                {passwordConfirmMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Button variant="link" onClick={() => navigate('/login')} className="w-full">
        Back to Login
      </Button>
    </div>
  );
};
