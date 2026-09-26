import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  UtensilsCrossed, 
  Calendar, 
  Wrench, 
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

// Static nav links removed. Will be dynamic based on role inside the component.

const roleColors: Record<string, string> = {
  ROLE_STUDENT: 'bg-[#776BFD]',
  ROLE_FACULTY: 'bg-[#807493]',
  ROLE_FOOD_STAFF: 'bg-[#F86B7E]',
  ROLE_ADMIN: 'bg-[#18181B]',
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getNavLinks = () => {
    if (!isAuthenticated || user?.role === 'ROLE_STUDENT') {
      return [
        ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard', icon: User }] : []),
        { name: 'Campus Map', href: '/map', icon: MapPin },
        { name: 'Faculty', href: '/faculty', icon: Users },
        { name: 'Food & Mess', href: '/food', icon: UtensilsCrossed },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Facilities', href: '/facilities', icon: Wrench },
        { name: 'Notices', href: '/announcements', icon: Bell },
      ];
    }
    if (user?.role === 'ROLE_FOOD_STAFF') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: UtensilsCrossed },
        { name: 'Facilities', href: '/facilities', icon: Wrench },
        { name: 'Notices', href: '/announcements', icon: Bell },
      ];
    }
    if (user?.role === 'ROLE_FACULTY') {
      return [
        { name: 'Workspace', href: '/dashboard', icon: User },
        { name: 'Faculty Directory', href: '/faculty', icon: Users },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Facilities', href: '/facilities', icon: Wrench },
        { name: 'Notices', href: '/announcements', icon: Bell },
      ];
    }
    if (user?.role === 'ROLE_ADMIN') {
      return [
        { name: 'Dashboard', href: '/admin', icon: Settings },
        { name: 'Campus Map', href: '/map', icon: MapPin },
        { name: 'Facilities', href: '/facilities', icon: Wrench },
        { name: 'Notices', href: '/announcements', icon: Bell },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-[#FDFDFD]/90 backdrop-blur-md border-b border-[#DFDFE0] shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-[#776BFD] to-[#F86B7E] rounded-2xl flex items-center justify-center shadow-md shadow-[#776BFD]/25">
              <span className="text-white font-extrabold text-xl">U</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-[#18181B] tracking-tight">UniYaar</h1>
              <p className="text-[11px] font-semibold text-[#636363] -mt-1">Apni Uni. Apna Yaar.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-[#636363] hover:text-[#18181B] hover:bg-[#DFDFE0]/50 rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                <link.icon className="w-4 h-4 text-[#776BFD]" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="flex items-center space-x-2 px-4 py-2 bg-[#FDFDFD] hover:bg-white border border-[#DFDFE0] rounded-xl text-[#636363] text-sm shadow-sm transition-all duration-200 hover:border-[#B6ADC3]"
            >
              <Search className="w-4 h-4 text-[#776BFD]" />
              <span>Search campus...</span>
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs bg-[#DFDFE0]/60 rounded-lg text-[#636363] font-mono">⌘K</kbd>
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3.5 bg-[#FDFDFD] hover:bg-white border border-[#DFDFE0] rounded-2xl shadow-sm transition-all hover:border-[#B6ADC3]"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm ${roleColors[user.role] || 'bg-[#776BFD]'}`}>
                    {getInitials(user.fullName)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#18181B] leading-tight">{user.fullName.split(' ')[0]}</p>
                    <span className="text-[10px] text-[#636363] font-medium capitalize">{user.role.replace('ROLE_', '').replace('_', ' ').toLowerCase()}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#636363]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FDFDFD] border border-[#DFDFE0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#DFDFE0]">
                      <p className="text-xs font-bold text-[#18181B]">{user.fullName}</p>
                      <p className="text-[11px] text-[#636363] truncate">{user.email}</p>
                    </div>
                    {(user.role === 'ROLE_STUDENT' || user.role === 'ROLE_FACULTY' || user.role === 'ROLE_FOOD_STAFF') && (
                      <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-[#636363] hover:text-[#18181B] hover:bg-[#DFDFE0]/40">
                        <Settings className="w-3.5 h-3.5 text-[#776BFD]" />
                        <span>{user.role === 'ROLE_FACULTY' ? 'Faculty Workspace' : user.role === 'ROLE_FOOD_STAFF' ? 'Food Management' : 'My Dashboard'}</span>
                      </Link>
                    )}
                    {user.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-[#636363] hover:text-[#18181B] hover:bg-[#DFDFE0]/40"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#776BFD]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-[#F86B7E] hover:bg-[#F86B7E]/10 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-ghost flex items-center space-x-1.5 text-sm py-2 px-3 font-semibold">
                  <User className="w-4 h-4 text-[#776BFD]" />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn-primary text-xs py-2.5 px-4 font-bold rounded-xl">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#636363] hover:text-[#18181B]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#18181B]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-[#FDFDFD] border-b border-[#DFDFE0] shadow-lg"
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center space-x-3 px-3 py-3 text-[#636363] hover:text-[#18181B] hover:bg-[#DFDFE0]/40 rounded-xl transition-all duration-200 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon className="w-5 h-5 text-[#776BFD]" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-4 border-t border-[#DFDFE0]">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold ${roleColors[user.role] || 'bg-[#776BFD]'}`}>
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#18181B]">{user.fullName}</p>
                    <p className="text-xs text-[#636363]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full btn-ghost text-[#F86B7E] flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full btn-ghost flex items-center justify-center space-x-2 font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full btn-primary text-center py-2.5 rounded-xl text-sm font-bold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
