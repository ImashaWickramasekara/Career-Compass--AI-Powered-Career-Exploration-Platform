import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, User, LogIn, LogOut, BookOpen, Menu, X, LayoutDashboard, FileText } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success!",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-background border-b shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-career-purple to-career-blue flex items-center justify-center">
            <span className="text-white font-bold">CC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-career-purple to-career-blue bg-clip-text text-transparent">
            CareerCompass
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center gap-1 text-foreground hover:text-career-purple transition-colors">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/resources" className="flex items-center gap-1 text-foreground hover:text-career-purple transition-colors">
            <BookOpen size={18} />
            <span>Resources</span>
          </Link>
          {user && (
            <Link to="/cv-builder" className="flex items-center gap-1 text-foreground hover:text-career-purple transition-colors">
              <FileText size={18} />
              <span>CV Builder</span>
            </Link>
          )}
          
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2 border-career-purple text-career-purple hover:bg-career-purple hover:text-white">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2 border-career-purple text-career-purple hover:bg-career-purple hover:text-white">
                  <User size={18} />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-foreground hover:text-career-purple"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button className="flex items-center gap-2 bg-career-purple hover:bg-career-purple-dark text-white">
                  <LogIn size={18} />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="flex items-center gap-2 border-career-purple text-career-purple hover:bg-career-purple hover:text-white">
                  <User size={18} />
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 pt-16 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
              onClick={toggleMenu}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/resources" 
              className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
              onClick={toggleMenu}
            >
              <BookOpen size={20} />
              <span>Resources</span>
            </Link>
            {user && (
              <Link 
                to="/cv-builder" 
                className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
                onClick={toggleMenu}
              >
                <FileText size={20} />
                <span>CV Builder</span>
              </Link>
            )}
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
                  onClick={toggleMenu}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
                  onClick={toggleMenu}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted"
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 p-3 rounded-md bg-career-purple text-white"
                  onClick={toggleMenu}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center gap-2 p-3 rounded-md border border-career-purple text-career-purple hover:bg-career-purple hover:text-white"
                  onClick={toggleMenu}
                >
                  <User size={20} />
                  <span>Register</span>
                </Link>
              </div>
            )}
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={toggleMenu}
            >
              Close Menu
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
