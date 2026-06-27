import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex items-center justify-between h-14 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-center">
          <span className="font-bold text-lg tracking-tight">LinkSnip</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
