import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2,
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

const navLinks = [
  { name: 'Buildings', href: '/buildings', icon: Building2 },
  { name: 'Campus Map', href: '/map', icon: MapPin },
  { name: 'Faculty', href: '/faculty', icon: Users },
  { name: 'Food & Mess', href: '/food', icon: UtensilsCrossed },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Facilities', href: '/facilities', icon: Wrench },
  { name: 'Notices', href: '/announcements', icon: Bell },
];

const roleColors: Record<string, string> = {
  ROLE_STUDENT: 'bg-blue-500',
  ROLE_FACULTY: 'bg-purple-500',
  ROLE_STAFF: 'bg-orange-500',
  ROLE_ADMIN: 'bg-red-500',
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-lg' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold text-xl">U</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">UniYaar</h1>
              <p className="text-xs text-slate-400 -mt-1">Apni Uni. Apna Yaar.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-1 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 text-sm transition-all duration-200">
              <Search className="w-4 h-4" />
              <span>Search campus...</span>
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs bg-slate-700 rounded">⌘K</kbd>
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${roleColors[user.role] || 'bg-primary-500'}`}>
                    {getInitials(user.fullName)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.fullName.split(' ')[0]}</p>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role.replace('ROLE_', '').toLowerCase()}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-medium text-white">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-ghost flex items-center space-x-1.5 text-sm py-2 px-3">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-3 rounded-lg font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800"
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center space-x-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${roleColors[user.role] || 'bg-primary-500'}`}>
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full btn-ghost text-rose-400 flex items-center justify-center space-x-2"
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
                  className="w-full btn-ghost flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full btn-primary text-center py-2.5 rounded-lg text-sm font-medium"
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
