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
    <div className="min-h-screen bg-[#DFDFE0] text-[#18181B] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Emergency / Urgent Notice Ticker */}
        {urgentAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#FDFDFD] border-2 border-[#F86B7E]/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="p-2.5 rounded-2xl bg-[#F86B7E] text-white shrink-0 animate-pulse shadow-sm shadow-[#F86B7E]/30">
                <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D7344A]">
                    Emergency Broadcast
                  </span>
                  <span className="text-[#636363] text-xs">•</span>
                  <span className="text-xs text-[#636363] font-medium">{formatDate(urgentAnnouncements[0].createdAt)}</span>
                </div>
                <h4 className="text-base font-black text-[#18181B] leading-snug">
                  {urgentAnnouncements[0].title}
                </h4>
                <p className="text-xs text-[#636363] line-clamp-1 mt-0.5 font-medium">
                  {urgentAnnouncements[0].content}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNotice(urgentAnnouncements[0])}
              className="px-5 py-2.5 bg-[#D7344A] hover:bg-[#C22336] text-white font-bold rounded-2xl text-xs whitespace-nowrap transition-all shadow-md shadow-[#D7344A]/25 shrink-0 cursor-pointer"
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
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FDFDFD] border border-[#DFDFE0] rounded-full text-[#776BFD] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Official University Circulars</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-[#18181B] tracking-tight"
          >
            Campus Notice <span className="bg-gradient-to-r from-[#776BFD] to-[#F86B7E] bg-clip-text text-transparent">Board & Feed</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-base text-[#636363] font-medium"
          >
            Exam schedules, placement drives, holiday circulars, and departmental broadcasts in one place.
          </motion.p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#776BFD]" />
              <input
                type="text"
                placeholder="Search notices by keyword, department, or circular title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#DFDFE0] rounded-2xl text-sm text-[#18181B] placeholder-[#636363]/60 focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#636363] hover:text-[#18181B]"
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
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedAudience === aud
                      ? 'bg-[#776BFD] text-white shadow-md shadow-[#776BFD]/25'
                      : 'bg-white border border-[#DFDFE0] text-[#636363] hover:text-[#18181B] hover:border-[#B6ADC3]'
                  }`}
                >
                  {aud === 'ALL' ? 'Everyone' : aud.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Category Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#DFDFE0]">
            {/* Priority Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'URGENT', 'IMPORTANT', 'GENERAL', 'CLUB'] as const).map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedPriority(prio)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedPriority === prio
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'text-[#636363] hover:text-[#18181B] hover:bg-[#DFDFE0]/40'
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
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#776BFD] text-white shadow-xs'
                        : 'bg-white text-[#636363] hover:text-[#18181B] border border-[#DFDFE0] hover:border-[#B6ADC3]'
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
              <div key={i} className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 h-36 animate-pulse" />
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl shadow-sm">
            <Bell className="w-12 h-12 text-[#B6ADC3] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#18181B] mb-1">No announcements found</h3>
            <p className="text-sm text-[#636363] max-w-sm mx-auto mb-6">
              There are no notices matching your current search or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedPriority('ALL');
                setSelectedAudience('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#FDFDFD] hover:bg-white text-[#18181B] border border-[#DFDFE0] rounded-xl text-xs font-semibold shadow-xs"
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
                  <Pin className="w-4 h-4 text-[#F86B7E] fill-[#F86B7E]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F86B7E]">
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
                  <Sparkles className="w-4 h-4 text-[#776BFD]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#636363]">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/40 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#18181B]"
              >
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="absolute right-5 top-5 p-2 bg-[#DFDFE0]/50 hover:bg-[#DFDFE0] text-[#636363] hover:text-[#18181B] rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Priority & Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <PriorityPill priority={selectedNotice.priority} />
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#776BFD]/10 text-[#776BFD] border border-[#776BFD]/20">
                    {selectedNotice.category}
                  </span>
                  {selectedNotice.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#F86B7E]/10 text-[#F86B7E] border border-[#F86B7E]/20 flex items-center space-x-1">
                      <Pin className="w-3 h-3 fill-[#F86B7E]" />
                      <span>PINNED</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] mb-3 leading-snug tracking-tight">
                  {selectedNotice.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#636363] pb-4 mb-6 border-b border-[#DFDFE0]">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-[#776BFD]" />
                    <span className="text-[#18181B] font-bold">{selectedNotice.authorName}</span>
                  </div>
                  {selectedNotice.departmentName && (
                    <div className="flex items-center space-x-1.5">
                      <span>•</span>
                      <span>{selectedNotice.departmentName}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#636363]" />
                    <span>Published: {formatDate(selectedNotice.createdAt)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-[#18181B] leading-relaxed space-y-3 mb-8 whitespace-pre-line font-medium">
                  {selectedNotice.content}
                </div>

                {/* Attachment & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#DFDFE0]">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShare(selectedNotice)}
                      className="p-3 bg-[#DFDFE0]/40 hover:bg-[#DFDFE0] text-[#18181B] rounded-2xl transition-all flex items-center space-x-2 text-xs font-bold cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-[#776BFD]" />
                      <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                    </button>

                    {selectedNotice.externalLink && (
                      <a
                        href={selectedNotice.externalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 bg-white border border-[#DFDFE0] hover:border-[#776BFD] text-[#776BFD] rounded-2xl transition-all flex items-center space-x-2 text-xs font-bold"
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
                      className="px-6 py-3 bg-[#776BFD] hover:bg-[#6455F5] text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 shadow-md shadow-[#776BFD]/25"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Circular (PDF)</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedNotice(null)}
                      className="px-6 py-3 bg-[#DFDFE0]/50 hover:bg-[#DFDFE0] text-[#18181B] font-bold rounded-2xl text-xs transition-all cursor-pointer"
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
      className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-clean-lg ${
        notice.isPinned
          ? 'bg-[#FDFDFD] border-2 border-[#776BFD]/40 hover:border-[#776BFD]'
          : 'bg-[#FDFDFD] border-[#DFDFE0] hover:border-[#776BFD]/50'
      }`}
    >
      <div>
        {/* Top Chips */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <PriorityPill priority={notice.priority} />
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#DFDFE0]/50 text-[#636363]">
              {notice.category}
            </span>
          </div>

          {notice.isPinned && (
            <span className="flex items-center space-x-1 text-[11px] font-bold text-[#F86B7E] bg-[#F86B7E]/10 px-2.5 py-0.5 rounded-full border border-[#F86B7E]/20">
              <Pin className="w-3 h-3 fill-[#F86B7E]" />
              <span>PINNED</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          onClick={onSelect}
          className="text-lg font-black text-[#18181B] mb-2 leading-snug cursor-pointer group-hover:text-[#776BFD] transition-colors"
        >
          {notice.title}
        </h4>

        {/* Content Preview */}
        <p className="text-xs text-[#636363] line-clamp-3 mb-4 leading-relaxed font-medium">
          {notice.content}
        </p>
      </div>

      {/* Footer Meta & Actions */}
      <div className="pt-4 border-t border-[#DFDFE0] flex items-center justify-between text-xs text-[#636363]">
        <div className="flex items-center space-x-1.5 truncate max-w-[200px]">
          <User className="w-3.5 h-3.5 text-[#776BFD] shrink-0" />
          <span className="truncate font-semibold text-[#18181B]">{notice.authorName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onShare}
            className="p-1.5 text-[#636363] hover:text-[#18181B] rounded-lg transition-colors cursor-pointer"
            title="Share Notice"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onSelect}
            className="px-3.5 py-1.5 bg-[#776BFD] hover:bg-[#6455F5] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-[#F86B7E]/10 text-[#C22336] border border-[#F86B7E]/25 flex items-center space-x-1">
          <AlertOctagon className="w-3 h-3 stroke-[2.5]" />
          <span>URGENT</span>
        </span>
      );
    case 'IMPORTANT':
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#776BFD]/10 text-[#776BFD] border border-[#776BFD]/25">
          IMPORTANT
        </span>
      );
    case 'CLUB':
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#807493]/10 text-[#807493] border border-[#807493]/25">
          CLUB NOTICE
        </span>
      );
    case 'GENERAL':
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#DFDFE0]/60 text-[#636363]">
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
