import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  UtensilsCrossed, 
  Calendar, 
  Github, 
  Twitter,
  Heart
} from 'lucide-react';

const quickLinks = [
  { name: 'Campus Map', href: '/map', icon: MapPin },
  { name: 'Faculty Finder', href: '/faculty', icon: Users },
  { name: 'Food & Mess', href: '/food', icon: UtensilsCrossed },
  { name: 'Events', href: '/events', icon: Calendar },
];

const socialLinks = [
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Twitter', href: '#', icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-950 font-bold text-xl">U</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">UniYaar</h3>
                <p className="text-xs text-slate-400">Apni Uni. Apna Yaar.</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-md mb-4">
              Your smart campus companion. Find buildings, locate faculty, check mess menus, 
              discover events, and navigate campus with ease.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 hover:text-primary-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-500 text-sm transition-colors flex items-center space-x-2"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Emergency</h4>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">
                For campus emergencies, contact:
              </p>
              <p className="text-white font-medium">Security: 1800-XXX-XXXX</p>
              <p className="text-slate-500 text-xs mt-2">
                Available 24/7 for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-slate-500 text-sm">
              © 2026 UniYaar. Built with{' '}
              <Heart className="w-4 h-4 inline text-danger-500 fill-danger-500" />{' '}
              for students.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
