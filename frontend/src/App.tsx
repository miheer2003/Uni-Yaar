import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MapPin, Users, UtensilsCrossed, Calendar, Wrench, Sparkles, ChevronRight, CheckCircle2, AlertCircle, LucideIcon } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Buildings from './pages/Buildings';
import BuildingDetail from './pages/BuildingDetail';
import CampusMap from './pages/CampusMap';
import FacultyFinder from './pages/FacultyFinder';
import FacultyDetail from './pages/FacultyDetail';
import FoodMess from './pages/FoodMess';
import { Events } from './pages/Events';
import { Facilities } from './pages/Facilities';
import { Announcements } from './pages/Announcements';
import { AdminDashboard } from './pages/AdminDashboard';
import { CommandPalette } from './components/search/CommandPalette';
import { PublicRoute } from './components/auth/ProtectedRoute';
import { healthApi } from './api/client';

const features: { icon: LucideIcon; title: string; description: string; color: string; href: string }[] = [
  { icon: MapPin, title: 'Campus Map', description: 'Interactive maps with building locations and navigation.', color: 'from-blue-500 to-cyan-500', href: '/map' },
  { icon: Users, title: 'Faculty Finder', description: 'Find professors by name, department, or subject.', color: 'from-purple-500 to-pink-500', href: '/faculty' },
  { icon: UtensilsCrossed, title: 'Food & Mess', description: 'Daily mess menus, canteen timings, dietary filters.', color: 'from-orange-500 to-red-500', href: '/food' },
  { icon: Calendar, title: 'Events Hub', description: 'Hackathons, workshops, cultural events.', color: 'from-green-500 to-emerald-500', href: '/events' },
  { icon: Wrench, title: 'Facilities', description: 'Check facility status and report issues.', color: 'from-yellow-500 to-orange-500', href: '/facilities' },
  { icon: Sparkles, title: 'Smart Search', description: 'Cmd+K to search everything on campus.', color: 'from-primary-500 to-accent-500', href: '#' },
];

function HomePage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [backendVersion, setBackendVersion] = useState<string>('');

  useEffect(() => { checkBackendHealth(); }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await healthApi.check();
      if (response.data.success) { setBackendStatus('connected'); setBackendVersion(response.data.data.version); }
    } catch { setBackendStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-700 mb-8">
              {backendStatus === 'checking' && (<><div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" /><span className="text-slate-400 text-sm">Connecting...</span></>)}
              {backendStatus === 'connected' && (<><CheckCircle2 className="w-4 h-4 text-success-500" /><span className="text-success-500 text-sm">Backend v{backendVersion} Connected</span></>)}
              {backendStatus === 'error' && (<><AlertCircle className="w-4 h-4 text-danger-500" /><span className="text-danger-500 text-sm">Backend Disconnected</span></>)}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6"><span className="text-white">Your Campus, </span><span className="gradient-text">Simplified.</span></h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">Find buildings, locate faculty, check mess menus, discover events. <span className="text-primary-400">Apni Uni. Apna Yaar.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center space-x-2 text-lg"><MapPin className="w-5 h-5" /><span>Explore Campus</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary flex items-center space-x-2 text-lg"><span>Learn More</span><ChevronRight className="w-5 h-5" /></motion.button>
            </div>
            <div className="max-w-2xl mx-auto">
              <div
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="relative cursor-pointer"
              >
                <input
                  type="text"
                  readOnly
                  placeholder="Search buildings, faculty, events, food..."
                  className="input text-lg cursor-pointer"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-slate-950 font-semibold rounded-xl transition-colors"
                >
                  Search
                </button>
              </div>
              <p className="text-slate-500 text-sm mt-3">Press <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">Cmd+K</kbd> for quick search</p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need, <span className="gradient-text">One Platform</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">From finding your next class to checking what is for lunch, UniYaar puts your entire campus at your fingertips.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.a key={feature.title} href={feature.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }} className="card-hover group">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><feature.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to explore your campus?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Start discovering everything your university has to offer.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"><button className="btn-primary">Get Started</button><button className="btn-secondary">View Demo</button></div>
        </motion.div>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <CommandPalette />
      <Navbar />
      <main className="flex-1 pt-16 h-full relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><PublicRoute><Login /></PublicRoute></PageTransition>} />
            <Route path="/register" element={<PageTransition><PublicRoute><Register /></PublicRoute></PageTransition>} />
            <Route path="/buildings" element={<PageTransition><Buildings /></PageTransition>} />
            <Route path="/buildings/:id" element={<PageTransition><BuildingDetail /></PageTransition>} />
            <Route path="/map" element={<PageTransition><CampusMap /></PageTransition>} />
            <Route path="/faculty" element={<PageTransition><FacultyFinder /></PageTransition>} />
            <Route path="/faculty/:id" element={<PageTransition><FacultyDetail /></PageTransition>} />
            <Route path="/food" element={<PageTransition><FoodMess /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
            <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
            <Route path="/announcements" element={<PageTransition><Announcements /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
