import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ThumbsUp,
  Plus,
  X,
  Filter,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wifi,
  Zap,
  Droplets,
  Tv,
  Sparkles,
  Building2,
  Layers,
  Send,
} from 'lucide-react';
import { facilityApi, campusApi } from '../api/client';
import {
  MaintenanceNotice,
  IssueReport,
  IssueCategory,
  IssuePriority,
  IssueStatus,
  FacilityStatus,
  IssueReportRequest,
} from '../types/facility';
import { Building } from '../types/campus';

const ISSUE_CATEGORIES: { label: string; value: IssueCategory; icon: React.ElementType }[] = [
  { label: 'Plumbing & Water', value: 'PLUMBING', icon: Droplets },
  { label: 'Electrical & Power', value: 'ELECTRICAL', icon: Zap },
  { label: 'Elevator / Lift', value: 'ELEVATOR', icon: Layers },
  { label: 'AC / HVAC', value: 'HVAC_AC', icon: Flame },
  { label: 'Cleaning & Washroom', value: 'CLEANING', icon: Sparkles },
  { label: 'Wi-Fi & Network', value: 'NETWORK_WIFI', icon: Wifi },
  { label: 'Projector & AV', value: 'AV_PROJECTOR', icon: Tv },
  { label: 'Furniture & Desk', value: 'FURNITURE', icon: Building2 },
  { label: 'Other', value: 'OTHER', icon: Wrench },
];

export const Facilities: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'NOTICES' | 'REPORTS'>('NOTICES');
  const [notices, setNotices] = useState<MaintenanceNotice[]>([]);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | IssueCategory>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | IssueStatus>('ALL');
  const [upvotedIssues, setUpvotedIssues] = useState<Record<number, boolean>>({});

  // Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState<IssueReportRequest>({
    title: '',
    description: '',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    buildingId: undefined,
    specificLocation: '',
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load buildings for picker
      const bRes = await campusApi.getBuildings();
      if (bRes.data.success && bRes.data.data) {
        const buildingList = Array.isArray(bRes.data.data) ? bRes.data.data : (bRes.data.data as { content?: Building[] }).content || [];
        setBuildings(buildingList);
      }

      // Load notices
      const nRes = await facilityApi.getMaintenanceNotices();
      if (nRes.data.success && nRes.data.data && nRes.data.data.length > 0) {
        setNotices(nRes.data.data);
      } else {
        setNotices(DEMO_NOTICES);
      }

      // Load community reports
      const catParam = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const statusParam = selectedStatus === 'ALL' ? undefined : selectedStatus;
      const rRes = await facilityApi.getReports(catParam, statusParam);
      if (rRes.data.success && rRes.data.data && rRes.data.data.length > 0) {
        setReports(rRes.data.data);
      } else {
        setReports(DEMO_REPORTS);
      }
    } catch {
      setNotices(DEMO_NOTICES);
      setReports(DEMO_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reportId: number) => {
    if (upvotedIssues[reportId]) return;

    setUpvotedIssues((prev) => ({ ...prev, [reportId]: true }));
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvoteCount: r.upvoteCount + 1 } : r))
    );

    try {
      await facilityApi.upvoteReport(reportId);
    } catch {
      // Soft fail / already updated optimistic state
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setSubmitting(true);
    try {
      const res = await facilityApi.submitReport(formData);
      if (res.data.success && res.data.data) {
        setReports([res.data.data, ...reports]);
      } else {
        // Fallback optimistic insert
        const newReport: IssueReport = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority || 'MEDIUM',
          status: 'REPORTED',
          buildingId: formData.buildingId,
          buildingName: buildings.find((b) => b.id === formData.buildingId)?.name || 'Campus Building',
          specificLocation: formData.specificLocation,
          reportedByName: 'You (Student)',
          upvoteCount: 1,
          createdAt: new Date().toISOString(),
        };
        setReports([newReport, ...reports]);
      }

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setShowReportModal(false);
        setActiveTab('REPORTS');
        setFormData({
          title: '',
          description: '',
          category: 'PLUMBING',
          priority: 'MEDIUM',
          buildingId: undefined,
          specificLocation: '',
        });
      }, 1200);
    } catch {
      // Optimistic demo fallback
      const newReport: IssueReport = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority || 'MEDIUM',
        status: 'REPORTED',
        buildingId: formData.buildingId,
        buildingName: buildings.find((b) => b.id === formData.buildingId)?.name || 'Campus Building',
        specificLocation: formData.specificLocation,
        reportedByName: 'You (Student)',
        upvoteCount: 1,
        createdAt: new Date().toISOString(),
      };
      setReports([newReport, ...reports]);
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setShowReportModal(false);
        setActiveTab('REPORTS');
      }, 1000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Campus Infrastructure Desk</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
            >
              Facility Status & <span className="gradient-text">Issue Tracker</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-lg text-slate-400 max-w-2xl"
            >
              Real-time maintenance notices, elevator/AC outages, alternative workarounds, and student problem escalation.
            </motion.p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReportModal(true)}
            className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center space-x-2.5 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Report a Campus Issue</span>
          </motion.button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-3 mb-8">
          <button
            onClick={() => setActiveTab('NOTICES')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'NOTICES'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Active Maintenance Notices</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === 'NOTICES' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {notices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'REPORTS'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Community Issue Desk</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === 'REPORTS' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {reports.length}
            </span>
          </button>
        </div>

        {/* TAB 1: ACTIVE MAINTENANCE NOTICES */}
        {activeTab === 'NOTICES' && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-36 animate-pulse" />
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">All Campus Facilities Operational</h3>
                <p className="text-sm text-slate-400">No active closures or maintenance work reported right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="max-w-3xl">
                        {/* Notice Header */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <FacilityStatusBadge status={notice.status} />
                          {notice.affectedAsset && (
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              Asset: {notice.affectedAsset}
                            </span>
                          )}
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400 ml-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>ETA: {notice.estimatedResolutionTime || 'In Progress'}</span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                          {notice.description}
                        </p>

                        {/* Alternative Workaround Box */}
                        {notice.alternativeSuggestion && (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start space-x-3">
                            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-300">Recommended Alternative: </span>
                              <span>{notice.alternativeSuggestion}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Location & Navigation Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        <div className="text-left lg:text-right">
                          <div className="text-xs text-slate-500 font-semibold uppercase">Location</div>
                          <div className="text-sm font-bold text-white">
                            {notice.buildingName || 'Campus Facility'}
                          </div>
                          {notice.floorNumber !== undefined && (
                            <div className="text-xs text-slate-400">
                              Floor {notice.floorNumber} {notice.roomNumber ? `• Room ${notice.roomNumber}` : ''}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (notice.buildingId) {
                              navigate(`/map?focusBuildingId=${notice.buildingId}`);
                            } else {
                              navigate('/map');
                            }
                          }}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border border-slate-700"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>View on Map</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMUNITY ISSUE DESK */}
        {activeTab === 'REPORTS' && (
          <div>
            {/* Filters Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 mb-8">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                  <Filter className="w-4 h-4 text-primary-400" />
                  <span>Filter by Category & Status</span>
                </div>

                {/* Status Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
                  {(['ALL', 'REPORTED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedStatus === st
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                          : 'bg-slate-800/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'ALL'
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Issues
                </button>
                {ISSUE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-white text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reports List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-36 animate-pulse" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No community reports found</h3>
                <p className="text-sm text-slate-400 mb-6">There are no reports matching this category filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const isUpvoted = upvotedIssues[report.id];
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all shadow-lg"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Upvote Escalation Button */}
                        <button
                          onClick={() => handleUpvote(report.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 shrink-0 ${
                            isUpvoted
                              ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 mb-1 ${isUpvoted ? 'fill-primary-400 text-primary-400' : ''}`} />
                          <span className="text-xs font-black">{report.upvoteCount}</span>
                          <span className="text-[10px] text-slate-500">votes</span>
                        </button>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-primary-400 border border-slate-700">
                              {report.category.replace('_', ' ')}
                            </span>
                            <PriorityBadge priority={report.priority} />
                            <IssueStatusBadge status={report.status} />
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1.5">{report.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3">{report.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-400" />
                              <span>{report.buildingName || 'Campus'} {report.specificLocation ? `(${report.specificLocation})` : ''}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Reported by {report.reportedByName}</span>
                            </div>
                          </div>

                          {/* Staff Notes if any */}
                          {report.staffNotes && (
                            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                              <span className="font-bold">Staff Resolution Note: </span>
                              <span>{report.staffNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Map Action */}
                      <button
                        onClick={() => {
                          if (report.buildingId) {
                            navigate(`/map?focusBuildingId=${report.buildingId}`);
                          } else {
                            navigate('/map');
                          }
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shrink-0 self-end md:self-center"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Map Location</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUBMIT ISSUE MODAL */}
        <AnimatePresence>
          {showReportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
              >
                <button
                  onClick={() => setShowReportModal(false)}
                  className="absolute right-5 top-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Wrench className="w-4 h-4" />
                  <span>Student Issue Escalation</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">Report a Campus Issue</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Help improve campus facilities. Maintenance teams and student council monitor this feed continuously.
                </p>

                {formSuccess ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-2">Issue Reported Successfully!</h3>
                    <p className="text-xs text-slate-400">Maintenance desk will review and assign staff shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReport} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Issue Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Water cooler leaking on 2nd Floor"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as IssueCategory })}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {ISSUE_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Priority Level
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as IssuePriority })}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="LOW">Low (Cosmetic / Minor)</option>
                          <option value="MEDIUM">Medium (Normal)</option>
                          <option value="HIGH">High (Urgent Attention)</option>
                          <option value="CRITICAL">Critical (Hazard / Emergency)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Building
                        </label>
                        <select
                          value={formData.buildingId || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              buildingId: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select Building (Optional)</option>
                          {buildings.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Specific Spot / Room
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Washroom 204 or Staircase B"
                          value={formData.specificLocation || ''}
                          onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Explain what is broken, dangerous, or needs repair..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowReportModal(false)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-primary-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Submitting...' : 'Submit Issue'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Facility status badges
const FacilityStatusBadge: React.FC<{ status: FacilityStatus }> = ({ status }) => {
  switch (status) {
    case 'UNDER_MAINTENANCE':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>UNDER MAINTENANCE</span>
        </span>
      );
    case 'TEMPORARILY_CLOSED':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>TEMPORARILY CLOSED</span>
        </span>
      );
    case 'RESTRICTED_ACCESS':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5">
          <span>RESTRICTED ACCESS</span>
        </span>
      );
    case 'OPERATIONAL':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>OPERATIONAL</span>
        </span>
      );
  }
};

// Priority badge
const PriorityBadge: React.FC<{ priority: IssuePriority }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3" />
          <span>CRITICAL</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          HIGH PRIORITY
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-500">
          LOW
        </span>
      );
  }
};

// Status progression badge
const IssueStatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => {
  switch (status) {
    case 'REPORTED':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
          ● Reported
        </span>
      );
    case 'IN_REVIEW':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ◐ Under Review
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          ⚙ In Progress
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ✓ Resolved
        </span>
      );
    case 'DISMISSED':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-500">
          Dismissed
        </span>
      );
  }
};

// Demo Maintenance Notices
const DEMO_NOTICES: MaintenanceNotice[] = [
  {
    id: 1,
    title: 'Elevator #2 Periodic Cable Inspection & Servicing',
    description: 'Scheduled preventive lift overhaul by Otis technical engineering team. Power is disconnected to elevator shaft.',
    status: 'UNDER_MAINTENANCE',
    affectedAsset: 'Passenger Elevator #2 (South Wing)',
    buildingId: 1,
    buildingName: 'Academic Block A (Engineering)',
    floorNumber: 0,
    alternativeSuggestion: 'Please use Elevator #1 in the North Wing or the central wide ramp for wheelchair access.',
    estimatedResolutionTime: 'Today by 5:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Central Library 3rd Floor HVAC Chiller Unit Maintenance',
    description: 'Air conditioning compressor replacement ongoing on the 3rd floor quiet reference zone.',
    status: 'RESTRICTED_ACCESS',
    affectedAsset: 'Chilled Air Circulation Zone 3',
    buildingId: 2,
    buildingName: 'Central Library & Tech Hub',
    floorNumber: 3,
    alternativeSuggestion: 'Floors 1 & 2 silent digital study pods are fully operational with climate control.',
    estimatedResolutionTime: 'Tomorrow morning 10:00 AM',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Water Purification Filter Cartridge Replacement',
    description: 'RO UV water station undergoing quarterly membrane flush and testing near Computer Lab 204.',
    status: 'TEMPORARILY_CLOSED',
    affectedAsset: 'Pure Water Dispenser #4',
    buildingId: 1,
    buildingName: 'Academic Block A',
    floorNumber: 2,
    alternativeSuggestion: 'Cold water dispenser is fully functional opposite Seminar Hall 208 down the corridor.',
    estimatedResolutionTime: 'Today by 2:30 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Demo Community Reports
const DEMO_REPORTS: IssueReport[] = [
  {
    id: 1,
    title: 'Ceiling projector lamp flickering rapidly in Lecture Hall 101',
    description: 'During CS lectures the HDMI output blacks out every 3 minutes. Makes coding slides unreadable.',
    category: 'AV_PROJECTOR',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    buildingId: 1,
    buildingName: 'Academic Block A',
    specificLocation: 'Lecture Hall 101 Ground Floor',
    reportedByName: 'Aarav Patel (CS 3rd Year)',
    upvoteCount: 28,
    staffNotes: 'Technician dispatched with spare Epson lamp module.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    title: 'Slow Wi-Fi connectivity and packet drop near Student Activity Center Cafe',
    description: 'EDUROAM and Campus-Student SSIDs keep disconnecting near the indoor badminton court.',
    category: 'NETWORK_WIFI',
    priority: 'MEDIUM',
    status: 'IN_REVIEW',
    buildingId: 3,
    buildingName: 'Student Activity Center',
    specificLocation: '1st Floor Cafeteria Zone',
    reportedByName: 'Priya Sharma (Design Dept)',
    upvoteCount: 42,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 3,
    title: 'Restroom tap dripping continuously on 2nd Floor Block A',
    description: 'Water faucet in men restroom near Lab 202 is loose and wasting clean water.',
    category: 'PLUMBING',
    priority: 'LOW',
    status: 'REPORTED',
    buildingId: 1,
    buildingName: 'Academic Block A',
    specificLocation: 'Men Washroom next to Lab 202',
    reportedByName: 'Rohan Deshmukh (Mech 2nd Year)',
    upvoteCount: 9,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
];
