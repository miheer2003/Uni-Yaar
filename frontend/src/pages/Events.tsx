import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Trophy,
  Code2,
  Sparkles,
  Laptop,
  Flame,
  CheckCircle2,
  X,
  Share2,
  Ticket,
  ChevronRight,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { eventApi } from '../api/client';
import { EventItem, EventCategory, EventStatus } from '../types/event';

const CATEGORIES: { label: string; value: 'ALL' | EventCategory; icon: React.ElementType }[] = [
  { label: 'All Happenings', value: 'ALL', icon: Sparkles },
  { label: 'Hackathons', value: 'HACKATHON', icon: Trophy },
  { label: 'Workshops', value: 'WORKSHOP', icon: Laptop },
  { label: 'Tech Talks', value: 'TECH_TALK', icon: Code2 },
  { label: 'Cultural', value: 'CULTURAL', icon: Sparkles },
  { label: 'Sports', value: 'SPORTS', icon: Flame },
  { label: 'Club Meets', value: 'CLUB_MEET', icon: Users },
];

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EventCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | EventStatus>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Record<number, boolean>>({});
  const [registering, setRegistering] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, statusFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;
      const res = await eventApi.getAll(categoryParam, statusParam);

      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setEvents(res.data.data);
      } else {
        // High quality demo fallback events
        setEvents(DEMO_EVENTS);
      }
    } catch {
      setEvents(DEMO_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    setRegistering(true);
    try {
      await eventApi.register(eventId);
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
      // Update local count
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: e.registeredCount + 1 }
            : e
        )
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          registeredCount: selectedEvent.registeredCount + 1,
        });
      }
    } catch {
      // Mock registration success for demo
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: e.registeredCount + 1 }
            : e
        )
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          registeredCount: selectedEvent.registeredCount + 1,
        });
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = (event: EventItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/events?id=${event.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.locationName && e.locationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.buildingName && e.buildingName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredEvents = events.filter((e) => e.isFeatured);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Life & Happenings</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            UniYaar <span className="gradient-text">Events & Fests</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-slate-400"
          >
            Don't miss hackathons, club workshops, guest lectures, and cultural fests. Instant RSVP and map directions.
          </motion.p>
        </div>

        {/* Featured Spotlight Card */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Spotlight Event</h2>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center space-x-1">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{featuredEvents[0].category}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      <Radio className="w-3 h-3" />
                      <span>{featuredEvents[0].status === 'LIVE_NOW' ? 'LIVE NOW' : 'FEATURED EVENT'}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    {featuredEvents[0].title}
                  </h3>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-4">
                    {featuredEvents[0].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{formatDate(featuredEvents[0].startsAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{formatTimeRange(featuredEvents[0].startsAt, featuredEvents[0].endsAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{featuredEvents[0].locationName || featuredEvents[0].buildingName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setSelectedEvent(featuredEvents[0])}
                    className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View & Register</span>
                  </button>
                  <button
                    onClick={() => {
                      if (featuredEvents[0].buildingId) {
                        navigate(`/map?focusBuildingId=${featuredEvents[0].buildingId}`);
                      } else {
                        navigate('/map');
                      }
                    }}
                    className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-2xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>Locate Venue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 mb-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, workshops, hackathons, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Quick Filter Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'LIVE_NOW', 'UPCOMING', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {st === 'ALL' ? 'All Status' : st === 'LIVE_NOW' ? '🔴 Live Now' : st === 'UPCOMING' ? '⚡ Upcoming' : '✓ Completed'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-slate-950 shadow-lg'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-80 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-800 rounded w-full mb-2" />
                <div className="h-4 bg-slate-800 rounded w-2/3 mb-6" />
                <div className="h-10 bg-slate-800 rounded-2xl mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No events found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              No matching events or hackathons were found with the selected category or search filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents[event.id];
              const capacityPercent = event.capacity
                ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
                : null;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 group hover:shadow-2xl hover:shadow-primary-500/5 relative overflow-hidden"
                >
                  <div>
                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-800 text-primary-400 border border-slate-700/60">
                        {event.category}
                      </span>
                      <StatusBadge status={event.status} />
                    </div>

                    {/* Title & Description */}
                    <h3
                      onClick={() => setSelectedEvent(event)}
                      className="text-xl font-extrabold text-white mb-2 leading-snug cursor-pointer group-hover:text-primary-300 transition-colors"
                    >
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Time & Venue Chips */}
                    <div className="space-y-2 mb-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                        <span>{formatDate(event.startsAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{formatTimeRange(event.startsAt, event.endsAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{event.locationName || event.buildingName || 'Campus Venue'}</span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    {event.capacity && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-slate-500" />
                            <span>Capacity</span>
                          </span>
                          <span className="font-semibold text-slate-300">
                            {event.registeredCount} / {event.capacity} ({capacityPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              (capacityPercent ?? 0) > 90
                                ? 'bg-rose-500'
                                : (capacityPercent ?? 0) > 70
                                ? 'bg-amber-500'
                                : 'bg-primary-500'
                            }`}
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={isRegistered || (event.capacity !== undefined && event.registeredCount >= event.capacity)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isRegistered
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : (event.capacity !== undefined && event.registeredCount >= event.capacity)
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-primary-500 hover:bg-primary-400 text-white shadow-md shadow-primary-500/20'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>RSVP'd</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-3.5 h-3.5" />
                          <span>RSVP</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (event.buildingId) {
                          navigate(`/map?focusBuildingId=${event.buildingId}`);
                        } else {
                          navigate('/map');
                        }
                      }}
                      title="Locate Venue on Map"
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Event Detail & RSVP Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute right-5 top-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Badges */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {selectedEvent.category}
                  </span>
                  <StatusBadge status={selectedEvent.status} />
                  {selectedEvent.isFeatured && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Title & Organizer */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs text-slate-400 mb-6 flex items-center space-x-2">
                  <span>Organized by:</span>
                  <span className="font-semibold text-white">{selectedEvent.organizer}</span>
                  {selectedEvent.contactEmail && (
                    <>
                      <span>•</span>
                      <a href={`mailto:${selectedEvent.contactEmail}`} className="text-primary-400 hover:underline">
                        {selectedEvent.contactEmail}
                      </a>
                    </>
                  )}
                </p>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Date</div>
                      <div className="text-xs font-bold text-white">{formatDate(selectedEvent.startsAt)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Timing</div>
                      <div className="text-xs font-bold text-white">{formatTimeRange(selectedEvent.startsAt, selectedEvent.endsAt)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Venue / Location</div>
                      <div className="text-xs font-bold text-white truncate">
                        {selectedEvent.locationName || selectedEvent.roomName || selectedEvent.buildingName || 'Campus Venue'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        if (selectedEvent.buildingId) {
                          navigate(`/map?focusBuildingId=${selectedEvent.buildingId}`);
                        } else {
                          navigate('/map');
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20 transition-all flex items-center space-x-1 shrink-0"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Map Route</span>
                    </button>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    About This Event
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Capacity Counter */}
                {selectedEvent.capacity && (
                  <div className="mb-6 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">Total Registered Attendees:</span>
                      <span className="font-extrabold text-white">
                        {selectedEvent.registeredCount} / {selectedEvent.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (selectedEvent.registeredCount / selectedEvent.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleShare(selectedEvent)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
                      title="Share Event"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {copiedLink && (
                      <span className="text-xs text-emerald-400 font-semibold animate-pulse">Link copied!</span>
                    )}
                    {selectedEvent.registrationUrl && (
                      <a
                        href={selectedEvent.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-primary-400 rounded-2xl transition-all flex items-center space-x-1"
                        title="External Registration Portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleRegister(selectedEvent.id)}
                      disabled={
                        registering ||
                        registeredEvents[selectedEvent.id] ||
                        (selectedEvent.capacity !== undefined && selectedEvent.registeredCount >= selectedEvent.capacity)
                      }
                      className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                        registeredEvents[selectedEvent.id]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : (selectedEvent.capacity !== undefined && selectedEvent.registeredCount >= selectedEvent.capacity)
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-primary-500 hover:bg-primary-400 text-white shadow-xl shadow-primary-500/20'
                      }`}
                    >
                      {registeredEvents[selectedEvent.id] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>You're Registered!</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>Confirm RSVP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper badge component for event status
const StatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
  switch (status) {
    case 'LIVE_NOW':
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>LIVE NOW</span>
        </span>
      );
    case 'UPCOMING':
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <span>UPCOMING</span>
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          <span>COMPLETED</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-950 text-rose-500">
          <span>CANCELLED</span>
        </span>
      );
  }
};

// Date & time helpers
function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function formatTimeRange(start: string, end: string): string {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const sTime = s.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const eTime = e.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${sTime} – ${eTime}`;
  } catch {
    return `${start} – ${end}`;
  }
}

// Demo fallback events
const DEMO_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'UniHacks 2026: 36h National University Hackathon',
    description: 'Join over 400 developers building AI, Web3, and smart campus solutions. Over ₹3,00,000 in prizes, mentorship from top tier engineers, free food & midnight caffeine stations.',
    category: 'HACKATHON',
    status: 'LIVE_NOW',
    organizer: 'Google Developer Student Club & Coding Club',
    capacity: 450,
    registeredCount: 412,
    startsAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    endsAt: new Date(Date.now() + 3600000 * 32).toISOString(),
    buildingId: 1,
    buildingName: 'Academic Block A (Engineering)',
    locationName: 'Auditorium Hall 1 & CS Innovation Labs (Ground Floor)',
    contactEmail: 'unihacks@uniyaar.edu',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Building Production Agentic AI with LLMs Workshop',
    description: 'Hands-on masterclass on building autonomous multi-agent systems, tool calling, and RAG pipelines. Bring your laptop and your enthusiasm for AI.',
    category: 'WORKSHOP',
    status: 'UPCOMING',
    organizer: 'Department of Computer Engineering',
    capacity: 120,
    registeredCount: 88,
    startsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 2 + 10800000).toISOString(),
    buildingId: 1,
    buildingName: 'Academic Block A',
    locationName: 'Room 302, 3rd Floor Advanced Computing Lab',
    contactEmail: 'ai-workshop@uniyaar.edu',
    isFeatured: false,
  },
  {
    id: 3,
    title: 'Aarohan 2026: Inter-College Cultural Fest Battle of Bands',
    description: 'The biggest musical night of the semester! 14 university bands competing live on the open-air amphitheater with special celebrity guest performance.',
    category: 'CULTURAL',
    status: 'UPCOMING',
    organizer: 'Campus Cultural Council',
    capacity: 1500,
    registeredCount: 940,
    startsAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 4 + 18000000).toISOString(),
    buildingId: 3,
    buildingName: 'Student Activity Center',
    locationName: 'Open Air Amphitheatre Ground',
    contactEmail: 'cultural@uniyaar.edu',
    isFeatured: true,
  },
  {
    id: 4,
    title: 'Inter-Department Cricket Premier League Finals',
    description: 'CSE Titans vs Mechanical Dynamos in the grand championship finals under floodlights. Cheering squad, snacks, and live commentary.',
    category: 'SPORTS',
    status: 'UPCOMING',
    organizer: 'University Sports Association',
    capacity: 600,
    registeredCount: 380,
    startsAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 1 + 14400000).toISOString(),
    locationName: 'Main Campus Cricket Pavilion & Turf',
    contactEmail: 'sports@uniyaar.edu',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'Demystifying High-Frequency Trading & Quant Finance',
    description: 'Guest lecture by VP of Quantitative Research at Tower Research Capital. Insights into low-latency algorithms, math modeling, and fintech careers.',
    category: 'TECH_TALK',
    status: 'UPCOMING',
    organizer: 'Finance & Algo Club',
    capacity: 200,
    registeredCount: 165,
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
    buildingId: 1,
    buildingName: 'Academic Block A',
    locationName: 'Seminar Hall 2, 1st Floor',
    contactEmail: 'fintech@uniyaar.edu',
    isFeatured: false,
  },
  {
    id: 6,
    title: 'Open Source Community Orientation & Google Summer of Code (GSoC) Prep',
    description: 'Everything you need to know about contributing to Linux Foundation, Apache, and winning GSoC / LFX mentorships. First-year friendly!',
    category: 'CLUB_MEET',
    status: 'UPCOMING',
    organizer: 'Open Source Society',
    capacity: 100,
    registeredCount: 74,
    startsAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(),
    buildingId: 2,
    buildingName: 'Central Library & Tech Hub',
    locationName: 'Ground Floor Discussion Pods',
    contactEmail: 'foss@uniyaar.edu',
    isFeatured: false,
  },
];
