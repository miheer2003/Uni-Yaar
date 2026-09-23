import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  DoorOpen,
  User,
  UtensilsCrossed,
  Calendar,
  Bell,
  Wrench,
  X,
  ArrowRight,
  Bookmark as BookmarkIcon,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { searchApi } from '../../api/client';
import { SearchResultItem, SearchItemType } from '../../types/search';

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedBookmarks, setSavedBookmarks] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync prop state if controlled
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      if (customEvent.detail && customEvent.detail.query) {
        setQuery(customEvent.detail.query);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    // Load recent searches from localStorage
    try {
      const stored = localStorage.getItem('uniyaar_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
      const bookmarks = localStorage.getItem('uniyaar_bookmarks');
      if (bookmarks) setSavedBookmarks(JSON.parse(bookmarks));
    } catch {
      // Ignore
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.query(query);
        if (res.data.success && res.data.data && res.data.data.results.length > 0) {
          setResults(res.data.data.results);
        } else {
          // Instant smart local filter on fallback dataset
          const filtered = DEMO_SEARCH_DATA.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
              (item.details && item.details.toLowerCase().includes(query.toLowerCase()))
          );
          setResults(filtered);
        }
      } catch {
        const filtered = DEMO_SEARCH_DATA.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            (item.details && item.details.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered);
      } finally {
        setLoading(false);
        setSelectedIndex(0);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    if (propOnClose) propOnClose();
  };

  const handleSelectResult = (item: SearchResultItem) => {
    // Save to recents
    const updated = [item.title, ...recentSearches.filter((s) => s !== item.title)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('uniyaar_recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    handleClose();
    navigate(item.targetUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const toggleBookmark = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    const key = `${item.type}_${item.id}`;
    const nextState = !savedBookmarks[key];
    const updated = { ...savedBookmarks, [key]: nextState };
    setSavedBookmarks(updated);
    try {
      localStorage.setItem('uniyaar_bookmarks', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const getItemIcon = (type: SearchItemType) => {
    switch (type) {
      case 'BUILDING':
        return Building2;
      case 'ROOM':
        return DoorOpen;
      case 'FACULTY':
        return User;
      case 'FOOD_OUTLET':
        return UtensilsCrossed;
      case 'EVENT':
        return Calendar;
      case 'ANNOUNCEMENT':
        return Bell;
      case 'MAINTENANCE':
        return Wrench;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-5 py-4 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search anything: 'Auditorium', 'Dr. Sharma', 'Mess Menu', 'Hackathon'..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-base focus:outline-none"
              />
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-500 hover:text-slate-300 rounded-lg shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-400 shrink-0">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Results or Empty State */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
              {query && results.length === 0 && !loading && (
                <div className="py-12 text-center text-slate-400">
                  <Search className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No campus matches found for "{query}"</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching by professor name, room code, canteen, or upcoming event.
                  </p>
                </div>
              )}

              {/* Suggestions / Shortcuts when query is empty */}
              {!query && (
                <div className="p-3">
                  {recentSearches.length > 0 && (
                    <div className="mb-5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
                        Recent Searches
                      </div>
                      <div className="flex flex-wrap gap-2 px-1">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
                      Quick Campus Jumps
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUICK_JUMPS.map((jump, idx) => {
                        const Icon = jump.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              handleClose();
                              navigate(jump.url);
                            }}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700 transition-all text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-xl ${jump.bgColor} ${jump.textColor}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{jump.title}</div>
                                <div className="text-[11px] text-slate-400">{jump.subtitle}</div>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results List */}
              {results.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1.5 flex items-center justify-between">
                    <span>Search Results ({results.length})</span>
                    <span>Use ↑↓ to navigate</span>
                  </div>

                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = getItemIcon(item.type);
                    const isBookmarked = savedBookmarks[`${item.type}_${item.id}`];

                    return (
                      <div
                        key={`${item.type}_${item.id}`}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary-500/15 border border-primary-500/30'
                            : 'hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isSelected
                                ? 'bg-primary-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400 group-hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-primary-400 border border-slate-700 shrink-0">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                            {item.details && (
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.details}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-3 shrink-0">
                          <button
                            onClick={(e) => toggleBookmark(e, item)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBookmarked
                                ? 'text-amber-400'
                                : 'text-slate-600 hover:text-slate-300'
                            }`}
                            title={isBookmarked ? 'Saved to Bookmarks' : 'Save Bookmark'}
                          >
                            <BookmarkIcon
                              className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`}
                            />
                          </button>

                          <div
                            className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                              isSelected
                                ? 'bg-primary-500 text-slate-950'
                                : 'text-slate-500 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Hotkeys Bar */}
            <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">↵</kbd>
                  <span>to select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">esc</kbd>
                  <span>to close</span>
                </span>
              </div>
              <span className="hidden sm:inline text-slate-600 text-[11px]">UniYaar Omnisearch</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Quick jumps configuration
const QUICK_JUMPS = [
  {
    title: 'Interactive Campus Map',
    subtitle: 'Explore buildings, gates, and route steps',
    url: '/map',
    icon: Sparkles,
    bgColor: 'bg-primary-500/10',
    textColor: 'text-primary-400',
  },
  {
    title: "Today's Mess Menu",
    subtitle: 'Breakfast, lunch, snacks & dinner scenes',
    url: '/food',
    icon: UtensilsCrossed,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
  },
  {
    title: 'Find Faculty & Timetables',
    subtitle: 'Professor office cabins and lectures',
    url: '/faculty',
    icon: User,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
  },
  {
    title: 'Events & Hackathons Hub',
    subtitle: 'Upcoming college fests and RSVP',
    url: '/events',
    icon: Calendar,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
  },
];

// Offline & instant demo search data
const DEMO_SEARCH_DATA: SearchResultItem[] = [
  {
    id: 1,
    type: 'BUILDING',
    title: 'Academic Block A (Engineering)',
    subtitle: 'Code: ENG-A • Main Campus West Wing',
    details: 'Departments: Computer Engineering, IT, AI & Data Science, Robotics',
    badge: 'BUILDING',
    targetUrl: '/buildings/1',
    buildingId: 1,
  },
  {
    id: 2,
    type: 'ROOM',
    title: 'Room 302 - Advanced Computing & AI Lab',
    subtitle: 'Academic Block A • Floor 3',
    details: 'Equipped with 60 GPU workstations, interactive smartboard, and high-speed LAN',
    badge: 'LAB',
    targetUrl: '/buildings/1',
    buildingId: 1,
    roomId: 302,
  },
  {
    id: 3,
    type: 'ROOM',
    title: 'Room 101 - Main University Auditorium',
    subtitle: 'Academic Block A • Ground Floor',
    details: 'Capacity: 450 seats • Central stage, Dolby sound system, automated projection',
    badge: 'AUDITORIUM',
    targetUrl: '/buildings/1',
    buildingId: 1,
  },
  {
    id: 4,
    type: 'FACULTY',
    title: 'Dr. Ramesh Sharma',
    subtitle: 'Professor & Head of Department • Computer Science',
    details: 'Cabin: Block A Room 301 • Office hours: 02:00 PM - 04:00 PM',
    badge: 'FACULTY',
    targetUrl: '/faculty/1',
  },
  {
    id: 5,
    type: 'FOOD_OUTLET',
    title: 'Central Student Mess (Annapurna)',
    subtitle: 'MESS • Hostel Complex Block A Ground Floor',
    details: '07:30 AM - 09:30 PM (OPEN) • North & South Indian meals',
    badge: 'MESS',
    targetUrl: '/food',
  },
  {
    id: 6,
    type: 'EVENT',
    title: 'UniHacks 2026: 36h National Hackathon',
    subtitle: 'HACKATHON • Organized by GDSC & Coding Club',
    details: 'Venue: Auditorium Hall 1 • Over ₹3,00,000 in prizes',
    badge: 'HACKATHON',
    targetUrl: '/events',
  },
  {
    id: 7,
    type: 'ANNOUNCEMENT',
    title: 'Heavy Monsoon Rain Advisory: Hybrid Classes',
    subtitle: 'URGENT Notice • Office of the Registrar',
    details: 'All undergraduate lecture sessions shifted to hybrid Google Meet mode',
    badge: 'URGENT',
    targetUrl: '/announcements',
  },
  {
    id: 8,
    type: 'MAINTENANCE',
    title: 'Elevator #2 Periodic Cable Inspection',
    subtitle: 'Status: UNDER MAINTENANCE • Academic Block A South Wing',
    details: 'Alt: Please use Elevator #1 in North Wing or central ramp',
    badge: 'MAINTENANCE',
    targetUrl: '/facilities',
  },
];
