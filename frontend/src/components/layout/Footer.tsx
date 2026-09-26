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
    <footer className="bg-[#FDFDFD] border-t border-[#DFDFE0] text-[#636363]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#776BFD] to-[#F86B7E] rounded-2xl flex items-center justify-center shadow-md shadow-[#776BFD]/20">
                <span className="text-white font-extrabold text-xl">U</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#18181B] tracking-tight">UniYaar</h3>
                <p className="text-xs font-medium text-[#636363]">Apni Uni. Apna Yaar.</p>
              </div>
            </div>
            <p className="text-[#636363] text-sm max-w-md mb-4 leading-relaxed">
              Your smart campus companion. Find buildings, locate faculty, check mess menus, 
              discover events, and navigate campus with ease.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#636363] hover:text-[#776BFD] transition-colors p-2 rounded-xl hover:bg-[#DFDFE0]/40"
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
            <h4 className="text-[#18181B] font-bold mb-4 tracking-tight">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#636363] hover:text-[#776BFD] text-sm font-semibold transition-colors flex items-center space-x-2"
                  >
                    <link.icon className="w-4 h-4 text-[#776BFD]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Info */}
          <div>
            <h4 className="text-[#18181B] font-bold mb-4 tracking-tight">Emergency</h4>
            <div className="bg-[#DFDFE0]/30 border border-[#DFDFE0] rounded-2xl p-4">
              <p className="text-[#636363] text-sm mb-1.5 font-medium">
                For campus emergencies, contact:
              </p>
              <p className="text-[#18181B] font-bold text-base">Security: 1800-XXX-XXXX</p>
              <p className="text-[#636363] text-xs mt-1.5 font-semibold">
                Available 24/7 for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#DFDFE0]">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-[#636363] text-sm font-medium">
              © 2026 UniYaar. Built with{' '}
              <Heart className="w-4 h-4 inline text-[#F86B7E] fill-[#F86B7E]" />{' '}
              for students.
            </p>
            <div className="flex items-center space-x-6 text-sm font-semibold">
              <a href="#" className="text-[#636363] hover:text-[#776BFD] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[#636363] hover:text-[#776BFD] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-[#636363] hover:text-[#776BFD] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
