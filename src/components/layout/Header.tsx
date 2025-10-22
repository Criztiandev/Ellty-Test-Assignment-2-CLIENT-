import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/use-auth';

export const Header = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            Number Conversations
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, <strong>{username}</strong>
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
