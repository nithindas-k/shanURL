import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';
import { LogOut, Menu, X, Link2 } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link 
          to={isAuthenticated ? '/dashboard' : '/'} 
          className="flex items-center space-x-2 text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="rounded-md bg-primary p-1.5 text-primary-foreground">
            <Link2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">SnapURL</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!isAuthenticated && !isAuthPage && (
            <>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
            </>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {location.pathname !== '/register' && (
                <Button size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              !isAuthPage && (
                <>
                  <a 
                    href="#features" 
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    How It Works
                  </a>
                </>
              )
            )}
          </nav>

          <div className="border-t border-border pt-4 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <div className="text-xs text-muted-foreground mb-1 px-1">Logged in as {user?.email}</div>
                <Button variant="ghost" size="sm" className="justify-start w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                )}
                {location.pathname !== '/register' && (
                  <Button size="sm" className="w-full justify-center" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/register">Get Started</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
