import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertOctagon,
  Pin,
  Search,
  Calendar,
  User,
  ExternalLink,
  Download,
  Share2,
  X,
  Sparkles,
  BookOpen,
  Briefcase,
  GraduationCap,
  Bus,
  Home,
  ShieldAlert,
} from 'lucide-react';
import { announcementApi } from '../api/client';
import {
  Announcement,
  AnnouncementPriority,
  AnnouncementCategory,
  AnnouncementAudience,
} from '../types/announcement';

const CATEGORIES: { label: string; value: 'ALL' | AnnouncementCategory; icon: React.ElementType }[] = [
  { label: 'All Notices', value: 'ALL', icon: Bell },
  { label: 'Exams', value: 'EXAM', icon: BookOpen },
  { label: 'Placements', value: 'PLACEMENT', icon: Briefcase },
  { label: 'Academics', value: 'ACADEMIC', icon: GraduationCap },
  { label: 'Transport', value: 'TRANSPORT', icon: Bus },
  { label: 'Hostel', value: 'HOSTEL', icon: Home },
  { label: 'Emergency', value: 'EMERGENCY', icon: ShieldAlert },
];

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [urgentAnnouncements, setUrgentAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'ALL' | AnnouncementPriority>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AnnouncementCategory>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<'ALL' | AnnouncementAudience>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, [selectedPriority, selectedCategory, selectedAudience]);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const prioParam = selectedPriority === 'ALL' ? undefined : selectedPriority;
      const catParam = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const audParam = selectedAudience === 'ALL' ? undefined : selectedAudience;

      const res = await announcementApi.getAll(prioParam, catParam, audParam);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setAnnouncements(res.data.data);
      } else {
        setAnnouncements(DEMO_ANNOUNCEMENTS);
      }

      // Check urgent notices
      const uRes = await announcementApi.getUrgent();
      if (uRes.data.success && uRes.data.data && uRes.data.data.length > 0) {
        setUrgentAnnouncements(uRes.data.data);
      } else {
        setUrgentAnnouncements(DEMO_ANNOUNCEMENTS.filter((a) => a.priority === 'URGENT'));
      }
    } catch {
      setAnnouncements(DEMO_ANNOUNCEMENTS);
      setUrgentAnnouncements(DEMO_ANNOUNCEMENTS.filter((a) => a.priority === 'URGENT'));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (notice: Announcement) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/announcements?id=${notice.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.departmentName && a.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'ALL' || a.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesAudience =
      selectedAudience === 'ALL' || a.targetAudience === 'ALL' || a.targetAudience === selectedAudience;

    return matchesSearch && matchesPriority && matchesCategory && matchesAudience;
  });

  const pinnedNotices = filteredAnnouncements.filter((a) => a.isPinned);
  const regularNotices = filteredAnnouncements.filter((a) => !a.isPinned);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Emergency / Urgent Notice Ticker */}
        {urgentAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-5 rounded-3xl bg-rose-950/60 border border-rose-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-rose-500 text-slate-950 shrink-0 animate-pulse">
                <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                    Emergency Broadcast
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400">{formatDate(urgentAnnouncements[0].createdAt)}</span>
                </div>
                <h4 className="text-base font-extrabold text-white leading-snug">
                  {urgentAnnouncements[0].title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {urgentAnnouncements[0].content}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNotice(urgentAnnouncements[0])}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap transition-all shadow-md shadow-rose-500/20 shrink-0"
            >
              Read Full Notice
            </button>
          </motion.div>
        )}

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Official University Circulars</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Campus Notice <span className="gradient-text">Board & Feed</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-slate-400"
          >
            Exam schedules, placement drives, holiday circulars, and departmental broadcasts in one place.
          </motion.p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 mb-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices by keyword, department, or circular title..."
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

            {/* Audience Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'STUDENTS', 'FACULTY', 'HOSTELLERS'] as const).map((aud) => (
                <button
                  key={aud}
                  onClick={() => setSelectedAudience(aud)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedAudience === aud
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {aud === 'ALL' ? 'Everyone' : aud.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Category Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            {/* Priority Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'URGENT', 'IMPORTANT', 'GENERAL', 'CLUB'] as const).map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedPriority(prio)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedPriority === prio
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {prio === 'ALL' ? 'All Priority' : prio}
                </button>
              ))}
            </div>

            {/* Categories Carousel */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-36 animate-pulse" />
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No announcements found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              There are no notices matching your current search or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedPriority('ALL');
                setSelectedAudience('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* PINNED NOTICES SECTION */}
            {pinnedNotices.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    Pinned Broadcasts
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedNotices.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onSelect={() => setSelectedNotice(notice)}
                      onShare={() => handleShare(notice)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* REGULAR NOTICES FEED */}
            <div>
              {pinnedNotices.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Recent Campus Notices
                  </h3>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onSelect={() => setSelectedNotice(notice)}
                    onShare={() => handleShare(notice)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTICE DETAIL MODAL */}
        <AnimatePresence>
          {selectedNotice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="absolute right-5 top-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Priority & Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <PriorityPill priority={selectedNotice.priority} />
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-primary-400 border border-slate-700">
                    {selectedNotice.category}
                  </span>
                  {selectedNotice.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                      <Pin className="w-3 h-3 fill-amber-300" />
                      <span>PINNED</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">
                  {selectedNotice.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 mb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-primary-400" />
                    <span className="text-white font-medium">{selectedNotice.authorName}</span>
                  </div>
                  {selectedNotice.departmentName && (
                    <div className="flex items-center space-x-1.5">
                      <span>•</span>
                      <span>{selectedNotice.departmentName}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Published: {formatDate(selectedNotice.createdAt)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-slate-300 leading-relaxed space-y-3 mb-8 whitespace-pre-line">
                  {selectedNotice.content}
                </div>

                {/* Attachment & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShare(selectedNotice)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all flex items-center space-x-2 text-xs font-semibold"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                    </button>

                    {selectedNotice.externalLink && (
                      <a
                        href={selectedNotice.externalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-primary-400 rounded-2xl transition-all flex items-center space-x-2 text-xs font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Official Portal</span>
                      </a>
                    )}
                  </div>

                  {selectedNotice.attachmentUrl ? (
                    <a
                      href={selectedNotice.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Circular (PDF)</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedNotice(null)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition-all"
                    >
                      Close
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Card component for individual notice
const NoticeCard: React.FC<{
  notice: Announcement;
  onSelect: () => void;
  onShare: () => void;
}> = ({ notice, onSelect, onShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between group hover:shadow-2xl ${
        notice.isPinned
          ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border-amber-500/30 hover:border-amber-500/50'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      <div>
        {/* Top Chips */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <PriorityPill priority={notice.priority} />
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-primary-400">
              {notice.category}
            </span>
          </div>

          {notice.isPinned && (
            <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Pin className="w-3 h-3 fill-amber-400" />
              <span>PINNED</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          onClick={onSelect}
          className="text-lg font-extrabold text-white mb-2 leading-snug cursor-pointer group-hover:text-primary-300 transition-colors"
        >
          {notice.title}
        </h4>

        {/* Content Preview */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {notice.content}
        </p>
      </div>

      {/* Footer Meta & Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1.5 truncate max-w-[200px]">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{notice.authorName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onShare}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Share Notice"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onSelect}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Read Notice
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Priority Pill Helper
const PriorityPill: React.FC<{ priority: AnnouncementPriority }> = ({ priority }) => {
  switch (priority) {
    case 'URGENT':
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1 animate-pulse">
          <AlertOctagon className="w-3 h-3 stroke-[2.5]" />
          <span>URGENT</span>
        </span>
      );
    case 'IMPORTANT':
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          IMPORTANT
        </span>
      );
    case 'CLUB':
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          CLUB NOTICE
        </span>
      );
    case 'GENERAL':
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300">
          GENERAL
        </span>
      );
  }
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Realistic demo fallback notices
const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Heavy Monsoon Rain Advisory: Instruction Shifted to Hybrid Mode Tomorrow',
    content:
      'Following Pune Municipal Corporation red alert and waterlogging near University North Gate, all undergraduate lecture sessions tomorrow will be conducted in hybrid online mode via Google Meet. Laboratories requiring physical equipment will be rescheduled. Hostels and mess facilities will operate as normal.',
    priority: 'URGENT',
    category: 'EMERGENCY',
    targetAudience: 'ALL',
    authorName: 'Office of the Registrar',
    isPinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Spring 2026 End-Semester Theory & Practical Exam Schedule Released',
    content:
      'The Controller of Examinations has published the finalized timetable for all B.Tech, M.Tech, and MBA degree examinations commencing from April 24th, 2026. Hall tickets will be downloadable via the student ERP portal from April 10th. Students must clear library dues prior to hall ticket verification.',
    priority: 'IMPORTANT',
    category: 'EXAM',
    targetAudience: 'STUDENTS',
    departmentName: 'Controller of Examinations',
    authorName: 'Dr. S. K. Mahajan (COE)',
    isPinned: true,
    attachmentUrl: '#',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: 'Microsoft & Google Campus Internship Hiring Drive 2026-27',
    content:
      'Training & Placement Cell is pleased to announce the arrival of Microsoft and Google software engineering internship drives for 3rd year CSE, IT, and AI/DS students. Shortlisting test will take place on Saturday, 10:00 AM in the Central Computing Labs. Minimum CGPA threshold: 7.50 with zero active backlogs.',
    priority: 'IMPORTANT',
    category: 'PLACEMENT',
    targetAudience: 'STUDENTS',
    departmentName: 'Training & Placement Cell',
    authorName: 'Prof. Anjali Ranade (TPO Head)',
    isPinned: true,
    externalLink: 'https://careers.microsoft.com',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 4,
    title: 'Campus Shuttle Bus Route #4 Schedule Shift during Flyover Work',
    content:
      'Due to municipal bridge expansion work near Shivaji Chowk, Campus Shuttle Bus #4 (connecting University Main Gate with Central Railway Station) will take the Ring Road diversion. Morning departure timings are advanced by 15 minutes starting Monday.',
    priority: 'GENERAL',
    category: 'TRANSPORT',
    targetAudience: 'ALL',
    departmentName: 'Campus Transport Division',
    authorName: 'Transport Incharge',
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 5,
    title: 'Hostel Annual Spring Night & Special Banquet Dinner',
    content:
      'The Annual Hostel Spring Gala will be celebrated this Friday across Hostel Blocks A, B, and C with live music performances, DJ night on the central turf, and a 4-course banquet dinner served by Annapurna Mess. Outside guests require valid guest passes signed by Chief Warden.',
    priority: 'GENERAL',
    category: 'HOSTEL',
    targetAudience: 'HOSTELLERS',
    authorName: 'Chief Hostel Warden',
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];
